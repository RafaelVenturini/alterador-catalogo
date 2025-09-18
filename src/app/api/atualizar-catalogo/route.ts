import {NextResponse} from 'next/server';
import {connection} from "@/util/database";
import {UpdateListBody} from "@/util/front-util";

export async function POST(req: Request) {
	const x = await req.json()
	const body: UpdateListBody = x.body
	
	if (body.value === 'on') {
		await connection.execute(
			`
                UPDATE catalogo
                SET ${body.id} = ${body.check}
                WHERE tiny_id = "${body.tiny_id}"
			`
		)
	} else {
		await connection.execute(
			`
                UPDATE catalogo
                SET prioridade = ${body.value}
                WHERE tiny_id = "${body.tiny_id}"
			`
		)
	}
	
	return NextResponse.json({situacao: 'Neymar 2028'});
}
