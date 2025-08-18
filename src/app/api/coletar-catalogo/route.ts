import {connection} from "@/util/database";

export async function GET() {
	try{
	    const [rows] = await connection.execute(`
	        SELECT
	            p.nome name,
	            p.sku,
	            p.img,
	            c.estoque,
	            c.novidade,
	            c.destaque,
	            c.reposicao,
	            c.prioridade
	        FROM produto p
	        LEFT JOIN catalogo c ON p.sku = c.sku
	        WHERE
	            img is not null
	          AND img <> '[]'
	        ;
	    `)
	
	    return new Response(JSON.stringify(rows), {
	        status: 200,
	        headers: { 'Content-Type': 'application/json' },
	    });
	}
	catch(e){
		console.log("Erro ao coletar Catalogo: ",e)
		return new Response(JSON.stringify({ error: e }), {
			status: 500,
		})
	}
}