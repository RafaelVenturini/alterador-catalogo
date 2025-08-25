import {WebHook} from "@/util/front-util";
import {getTiny} from "@/util/WebHook/product/main";

export async function POST(req: Request) {
	try {
		const body: WebHook = await req.json()
		
		const {cnpj, tipo, dados} = body
		if (cnpj === "16801255000193" && tipo === "estoque") {
			let productId = dados.idProduto
			if (!Array.isArray(productId)) productId = [productId]
			const resp = await getTiny(productId)
			if (resp && resp.status === "OK") {
				console.log(`Item ${productId} salvo com sucesso`)
				return Response.json({status: 200})
			} else {
				console.log(`Erro. o item ${productId} nao foi salvo`)
				console.log(resp.error)
				return Response.json({status: 500})
			}
		}
	} catch (e) {
		console.log("Erro ao receber WebHook: ", e)
		return Response.json({status: 500})
	}
}