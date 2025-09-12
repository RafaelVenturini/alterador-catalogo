import {WebHookBD} from "@/util/database";
import {pesquisar_id} from "@/util/WebHook/product/arrange-products";
import {
	AllProductsArranged,
	ProductFetched,
	sleep,
	TinyProducts
} from "@/util/front-util";

let page = 1
let dataProdutos: ProductFetched[] = []
let erros = 0

export async function updateImg() {
	const ids = await getDatabaseItensWithoutImg()
	for (const id of ids) {
		const res: TinyProducts = await pesquisar_id(id)
		if (res.anexos.length > 0) {
			const anexo = JSON.stringify(res.anexos).replaceAll('{"anexo":', '').replaceAll('}', '')
			const sql = `UPDATE produto
                         SET img = ?
                         WHERE tiny_id = ?`
			await WebHookBD.execute(sql, [anexo, id])
		} else {
			erros++
		}
	}
	return {erros: erros, success: ids.length - erros}
}

async function getDatabaseItensWithoutImg() {
	const sql = `SELECT tiny_id
                 FROM produto
                 WHERE img = '[]'`
	const [rows] = await WebHookBD.execute(sql)
	// @ts-expect-error map vem de array methods
	return rows.map(r => r.tiny_id)
}

export async function updateAllFromBd() {
	const data: ProductFetched[] = await receberProdutosPorData()
	console.log(`Total de itens: ${data.length}`)
	const newProducts: AllProductsArranged[] = []
	data.forEach(item => {
		const p = item.produto
		const newProduct = {
			id: p.id,
			nome: p.nome,
			sku: p.codigo,
			preco: p.preco,
			promo: p.preco_promocional,
			criacao: tinyDateToBdDate(p.data_criacao),
		}
		newProducts.push(newProduct)
	})
	
	
	for (const x of newProducts) {
		try {
			const sku = x.sku.split('-')
			let lastSku = sku[sku.length - 1]
			if (lastSku === '1') lastSku = sku[sku.length - 2]
			let cor = null
			let mult = null
			if (!isNaN(Number(lastSku))) {
				if (x.nome.includes('Bicolor') || x.nome.includes('Tricolor')) {
					mult = lastSku
				} else {
					cor = lastSku
				}
			}
			
			const sql = `
                UPDATE produto
                SET nome     = ?,
                    sku      = ?,
                    preco    = ?,
                    promocao = ?,
                    cor_id   = ?,
                    mul_id   = ?,
                    criacao  = ?
                WHERE tiny_id = ?
			`
			const insert = [x.nome, x.sku, x.preco, x.promo, cor, mult, x.criacao, x.id]
			
			await WebHookBD.execute(sql, insert)
		} catch (e) {
			console.log(e)
			console.log(x)
			break
		}
	}
	return {success: true}
}

export async function receberProdutosPorData() {
	const linkPesquisa = `https://api.tiny.com.br/api2/produtos.pesquisa.php?token=${process.env.TNY_TOKEN}&formato=json&pagina=${page}`
	const data = await (await fetch(linkPesquisa)).json()
	dataProdutos = dataProdutos.concat(data.retorno.produtos)
	
	if (data.retorno.produtos.length === 100) {
		await sleep(1000)
		page++
		return await receberProdutosPorData()
	} else {
		return dataProdutos
	}
}

function tinyDateToBdDate(date: string) {
	const onlyDate = date.split(' ')[0]
	const onlyNumbers = onlyDate.split('/')
	return `${onlyNumbers[2]}-${onlyNumbers[1]}-${onlyNumbers[0]}`
}