import {verifyPost} from "@/util/WebHook/nuvemshop/reusable";
import {
	getClientById
} from "@/util/WebHook/nuvemshop/client/arrange-client";

export async function POST(request: Request) {
	try {
		
		const verified = await verifyPost(request)
		
		if (!verified) {
			console.log("Erro ao verificar WebHook")
			return new Response("Unauthorized", {status: 401});
		}
		const data = await request.json();
		
		await getClientById(data.id)
		
		
		return new Response(`Webhook verified: ${verified}`, {status: 200});
	} catch (e) {
		console.log("Erro ao processar pedido: ", e)
		return new Response(`Error on webhook`, {status: 500})
	}
}