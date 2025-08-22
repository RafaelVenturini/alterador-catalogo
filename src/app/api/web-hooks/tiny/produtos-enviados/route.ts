import {WebHook} from "@/util/front-util";
import {getTiny} from "@/util/WebHook/product/main";

export async function POST(req: Request) {
	try {
		const body: WebHook = await req.json()
		
		const {cnpj, tipo, dados} = body
		if (cnpj === "16801255000193" && tipo === "estoque") {
			const productId = dados.idProduto
			
			await getTiny(productId)
			
			return Response.json({status: 200})
		}
	} catch (e) {
		console.log("Erro ao receber WebHook: ", e)
		return Response.json({status: 500})
	}
}