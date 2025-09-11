import {
	arrangeImg,
	arrangeSku,
	pesquisar_id
} from "@/util/WebHook/product/arrange-products";
import {onDuplicate, WebHookBD} from "@/util/database";

export async function getTiny(arr: number[]) {
	try {
		for (const id of arr) {
			console.log('Adicionando o item: ', id)
			const data = await pesquisar_id(id);
			
			const nome = data.nome
			const sku = data.codigo
			const preco = data.preco
			const ncm = data.ncm
			const anexo = arrangeImg(data.anexos)
			
			const {
				blu, inf, top,
				tec, tam, cor, mul
			} = arrangeSku(sku, nome)
			const criacao = new Date().toISOString().split('T')[0]
			
			const produto = [sku, id, nome, preco, anexo, tam, blu, cor, inf, mul, tec, top, criacao]
			await WebHookBD.execute(`INSERT INTO produto(sku, tiny_id,
                                                         nome,
                                                         preco, img,
                                                         tamanho,
                                                         blu_id,
                                                         cor_id, inf_id,
                                                         mul_id,
                                                         tec_id,
                                                         top_id,
                                                         criacao)
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,
                                             ?, ?, ?, ?)
                                     ON DUPLICATE KEY UPDATE ${onDuplicate(['sku', 'nome', 'preco', 'img', 'tamanho', 'blu_id', 'cor_id', 'inf_id', 'mul_id', 'tec_id',
                                         'top_id', 'criacao'])}
			`, produto)
		}
		return {status: "OK"}
	} catch (e) {
		//@ts-expect-error e = sqlError
		return {status: "Error", error: e.sqlMessage ? e.sqlMessage : e}
	}
}


