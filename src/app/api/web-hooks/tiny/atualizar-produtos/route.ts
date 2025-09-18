import {updateAllFromBd} from "@/util/WebHook/product/update-itens";
import {getProductByDate} from "@/util/WebHook/product/productsByDate";

export async function PATCH(req: Request) {
	try {
		const body = await req.json().catch(() => null)
		if (!body || Object.keys(body).length === 0) {
			const resp = await updateAllFromBd()
			return Response.json({
				status: 200,
				msg: "Itens atualizados com sucesso",
				...resp
			})
		} else {
			getProductByDate(body.date)
				.then(r => {
					console.log(r)
					return Response.json({
						status: 200,
						msg: "Itens atualizados com sucesso",
					})
				})
				.catch(e => {
					console.log(e)
					return Response.json({status: 400, error: e})
				})
		}
	} catch (e) {
		console.log("Erro ao receber WebHook: ", e)
		return Response.json({status: 400, error: e})
	}
}