import {pesquisar_id} from "@/util/WebHook/product/arrange-products";
import {WebHookBD} from "@/util/database";
import {error} from "next/dist/build/output/log";

export async function getTiny(arr) {
	try {
		
		for (const id in arr) {
			console.log('Adicionando o item: ', id)
			const data = await pesquisar_id(arr[id]);
			
			const nome = data.nome
			const sku = data.codigo
			const preco = data.preco
			const ncm = data.ncm
			const peso = data.peso_bruto
			const altura = data.alturaEmbalagem
			const largura = data.larguraEmbalagem
			const comprimento = data.comprimentoEmbalagem
			const anexo = (JSON.stringify(data.anexos)).replaceAll('{"anexo":', '').replaceAll('}', '')
			
			const skus = arrangeSku(sku, nome)
			const blu = skus[0]
			const inf = skus[1]
			const top = skus[2]
			const tec = skus[3]
			const tam = skus[4]
			const cor = skus[5]
			const mul = skus[6]
			
			const [plcaRow] = await WebHookBD.execute(`
                SELECT plca_id
                FROM plca
                WHERE peso = ?
                  AND largura = ?
                  AND comprimento = ?
                  AND altura = ?
			`, [peso, largura, comprimento, altura])
			
			let plca = "13"
			
			if (plcaRow[0] && plcaRow[0].plca_id) {
				plca = plcaRow[0].plca_id
			}
			
			
			const produto = [sku, arr[id], nome, preco, anexo, tam, blu, cor, inf, mul, tec, top, ncm, plca]
			console.log("Produto Gerado: ", produto)
			await WebHookBD.execute(`INSERT INTO produto(sku, tiny_id,
                                                         nome,
                                                         preco, img,
                                                         tamanho,
                                                         blu_id,
                                                         cor_id, inf_id,
                                                         mul_id,
                                                         tec_id,
                                                         top_id, ncm,
                                                         plca_id)
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                             ?,
                                             ?, ?,
                                             ?)
                                     ON DUPLICATE KEY UPDATE ${onDuplicate(['sku', 'nuvem_id', 'nome', 'preco', 'img', 'tamanho', 'blu_id', 'cor_id', 'inf_id', 'mul_id', 'tec_id',
                                         'top_id', 'ncm', 'plca_id'])}
			`, produto)
			console.log('item adicionado!')
			return {status: "OK"}
		}
	} catch (e) {
		return {status: "Error", error: e}
	}
}
