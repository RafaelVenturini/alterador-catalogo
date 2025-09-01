import {updateItens} from "@/util/WebHook/product/update-itens";

export async function PATCH() {
	try {
		const resp = await updateItens()
		if (resp.success === 0) console.log(`Nenhum item precisou ser atualizado`)
		console.log('Update Itens: ', resp)
		return Response.json({
			status: 200,
			msg: "Itens atualizados com sucesso",
			...resp
		})
	} catch (e) {
		console.log("Erro ao receber WebHook: ", e)
		return Response.json({status: 500, error: e})
	}
}