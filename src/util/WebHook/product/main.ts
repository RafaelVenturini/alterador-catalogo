import {
	arrangeImg,
	arrangeSku,
	pesquisar_id
} from "@/util/WebHook/product/arrange-products";
import {onDuplicate, WebHookBD} from "@/util/database";
import {ProductsById} from "@/util/interfaces";

export async function getTiny(arr: number[]) {
	try {
		for (const id of arr) {
			console.log('Adicionando o item: ', id)
			const data: ProductsById = await pesquisar_id(id);
			
			const nome = data.nome
			const sku = data.codigo
			const preco = data.preco
			const anexo = arrangeImg(data.anexos)
			
			const {
				blu, inf, top,
				tec, tam, cor, mul
			} = await arrangeSku(sku)
			
			const [existsSql] = await WebHookBD.execute(`SELECT tiny_id
                                                         FROM produto
                                                         WHERE tiny_id = ?`, [id])
			// @ts-expect-error existsSql = [exists]
			const exists = existsSql.length > 0
			
			const produto = [sku, id, nome, preco, anexo, tam, blu, cor, inf, mul, tec, top]
			let sql = `
                INSERT INTO produto(sku, tiny_id, nome,
                                    preco, img, tamanho,
                                    blu_id, cor_id, inf_id,
                                    mul_id, tec_id, top_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE ${onDuplicate(
                        ['sku', 'nome', 'preco',
                            'img', 'tamanho', 'blu_id',
                            'cor_id', 'inf_id', 'mul_id',
                            'tec_id', 'top_id'
                        ])}
			`
			
			if (!exists) {
				sql = sql
					.replace('top_id', 'top_id, criacao')
					.replace('?)', '?, NOW())')
			}
			
			await WebHookBD.execute(sql, produto)
		}
		return {status: "OK"}
	} catch (e) {
		//@ts-expect-error e = sqlError
		return {status: "Error", error: e.sqlMessage ? e.sqlMessage : e}
	}
}


