import {
	arrangeImg,
	arrangeSku,
	pesquisar_id,
	plcaId
} from "@/util/WebHook/product/arrange-products";
import {onDuplicate, WebHookBD} from "@/util/database";

export async function getTiny(arr: number[]) {
	try {
		for (const id of arr) {
			console.log('Adicionando o item: ', id)
			const data = await pesquisar_id(id);
			console.log('data: ', data)
			
			const nome = data.nome
			const sku = data.codigo
			const preco = data.preco
			const ncm = data.ncm
			const peso = data.peso_bruto
			const altura = data.alturaEmbalagem
			const largura = data.larguraEmbalagem
			const comprimento = data.comprimentoEmbalagem
			const anexo = arrangeImg(data.anexos)
			
			const skus = arrangeSku(sku, nome)
			const blu = skus.blu
			const inf = skus.inf
			const top = skus.top
			const tec = skus.tec
			const tam = skus.tam
			const cor = skus.cor
			const mul = skus.mul
			const plca = await plcaId(peso, largura, comprimento, altura)
			const criacao = new Date().toISOString().split('T')[0]

			const produto = [sku, id, nome, preco, anexo, tam, blu, cor, inf, mul, tec, top, ncm, plca, criacao]
			console.log("Produto a ser Gerado: ", produto)
			await WebHookBD.execute(`INSERT INTO produto(sku, tiny_id,
                                                         nome,
                                                         preco, img,
                                                         tamanho,
                                                         blu_id,
                                                         cor_id, inf_id,
                                                         mul_id,
                                                         tec_id,
                                                         top_id, ncm,
                                                         plca_id, criacao)
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                             ?, ?, ?, ?, ?)
                                     ON DUPLICATE KEY UPDATE ${onDuplicate(['sku', 'nome', 'preco', 'img', 'tamanho', 'blu_id', 'cor_id', 'inf_id', 'mul_id', 'tec_id',
                                         'top_id', 'ncm', 'plca_id', 'criacao'])}
			`, produto)
			console.log('item adicionado!')
		}
		return {status: "OK"}
	} catch (e) {
		return {status: "Error", error: e}
	}
}


