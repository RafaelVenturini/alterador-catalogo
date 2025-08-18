import { NextResponse } from 'next/server';
import {connection} from "@/util/database";
import {UpdateListBody} from "@/util/front-util";

export async function POST(req: Request) {
    const x = await req.json()
	const body:UpdateListBody = x.body
    console.log('Recebido: ',body)

    if (body.value === 'on'){
        await connection.execute(
            `
            UPDATE catalogo 
                SET ${body.id} = ${body.check}
            WHERE sku = "${body.sku}"
            `
        )
    }

    else{
        await connection.execute(
            `
            UPDATE catalogo 
                SET prioridade = ${body.value}
            WHERE sku = "${body.sku}"
            `
        )
    }

    return NextResponse.json({ situacao: 'Neymar 2028'});
}
