import {ProductFetched} from "@/util/front-util";

let page = 1
let dataProdutos: ProductFetched[] = []

export async function getProductByDate(date: string) {
	const linkPesquisa = `https://api.tiny.com.br/api2/produtos.pesquisa.php?token=${process.env.TNY_TOKEN}&formato=json&dataCriacao=${date}&pagina=${page}`
	
	const data = await (await fetch(linkPesquisa)).json()
	dataProdutos = dataProdutos.concat(data.retorno.produtos)
	
	if (data.retorno.produtos.length === 100) {
		page++
		return await getProductByDate(date)
	} else {
		return dataProdutos
	}
}

export async function pesquisar_id(id: number | string) {
	const linkPesquisa = `https://api.tiny.com.br/api2/produto.obter.php?token=${process.env.TNY_TOKEN}&formato=json&id=${id}`
	const data = await (await fetch(linkPesquisa)).json()
	return data.retorno.produto
}