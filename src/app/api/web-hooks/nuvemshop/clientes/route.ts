import {verifyPost} from "@/util/WebHook/nuvemshop/reusable";
import {
	getClientById
} from "@/util/WebHook/nuvemshop/client/arrange-client";


export async function POST(request: Request) {
	try {
		const verified = await verifyPost(request)
		if (!verified) {
			console.log("Erro ao verificar WebHook")
			return new Response("Verification Error", {status: 401});
		}
		const data = await request.json();
		const response = await getClientById(data.id)
		if (response && response.status === "error") {
			console.log("Erro ao processar cliente: ", response.message)
			return new Response(`Error processing client: ${response.message} on client ${response.clientId}`,
				{status: 500})
		}
		console.log("Cliente processado com sucesso")
		return new Response(`Webhook verified: ${verified}`, {status: 200});
	} catch (e) {
		console.log("Erro ao processar pedido: ", e)
		return new Response(`Error on webhook`, {status: 500})
	}
}