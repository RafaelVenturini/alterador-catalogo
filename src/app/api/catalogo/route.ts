import { NextResponse } from "next/server";
import { connection } from "@/util/database";
import { UpdateListBody } from "@/util/front-util";
import { linksShowroom, linksWhatsapp } from "@/util/catalog-links";

const isLiss = process.env.NEXT_PUBLIC_STORE === "liss";

export async function POST(req: Request) {
  try {
    const x = await req.json();
    const body: UpdateListBody = x.body;
    console.log(body);

    if (body.value === "on") {
      await connection.execute(
        `
          UPDATE ${isLiss ? "catalogo" : "vitrine"}
          SET ${body.id} = ${body.check}
          WHERE produto_id = "${body.tiny_id}"
				`,
      );
    } else {
      await connection.execute(
        `
          UPDATE ${isLiss ? "catalogo" : "vitrine"}
          SET prioridade = ${body.value}
          WHERE produto_id = "${body.tiny_id}"
				`,
      );
    }
  } catch (e) {
    console.log("Erro ao atualizar catalogo: ", e);
    return NextResponse.json({ err: e }, { status: 500 });
  }

  const opt = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const links = isLiss ? linksWhatsapp : linksShowroom;

  for (const url of links) {
    await fetch(`https://${url}/api/server/invalidar-cache`, opt);
  }

  return NextResponse.json(
    { message: "Catalogo atualizado com sucesso!" },
    { status: 200 },
  );
}

export async function GET() {
  const mainTable = isLiss ? "catalogo" : "vitrine";
  try {
    const [rows] = await connection.execute(`
            SELECT p.prod_id as tiny_id,
                   p.nome    name,
                   p.sku,
                   p.img,
                   p.tamanho,
                   i.tipo,
                   c.estoque,
                   c.novidade,
                   c.destaque,
                   c.reposicao,
                   c.prioridade,
                   cr.hex as hex,
                   cr.nome
            FROM produto p
                     LEFT JOIN ${mainTable} c ON p.prod_id = c.produto_id
                     LEFT JOIN inferior i ON p.inf_id = i.inf_id
                     LEFT JOIN cor cr ON p.cor_id = cr.cor_id
            WHERE img IS NOT NULL
              AND p.cor_id IS NOT NULL
              AND img <> '[]'

            UNION ALL

            SELECT p.prod_id as tiny_id,
                   p.nome                                    name,
                   p.sku,
                   p.img,
                   p.tamanho,
                   i.tipo,
                   c.estoque,
                   c.novidade,
                   c.destaque,
                   c.reposicao,
                   c.prioridade,
                   CONCAT_WS(',', cp.hex, cs.hex, ct.hex) as hex,
                   mt.nome
            FROM produto p
                     LEFT JOIN ${mainTable} c ON p.prod_id = c.produto_id
                     LEFT JOIN inferior i ON p.inf_id = i.inf_id
                     LEFT JOIN multcor mt ON p.mul_id = mt.mult_id
                     LEFT JOIN cor cp ON mt.cor_pri = cp.cor_id
                     LEFT JOIN cor cs ON mt.cor_sec = cs.cor_id
                     LEFT JOIN cor ct ON mt.cor_ter = ct.cor_id
            WHERE img IS NOT NULL
              AND p.mul_id IS NOT NULL
              AND img <> '[]'
            ;
		`);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.log("Erro ao coletar Catalogo: ", e);
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}
