import {
	getOrderById,
	processOrder
} from "@/util/WebHook/nuvemshop/order/arrange-orders";
import {verifyPost} from "@/util/WebHook/nuvemshop/reusable";

export async function POST(request: Request) {
	try {
		const verified = await verifyPost(request)
		if (!verified) {
			console.error("Erro ao verificar WebHook")
			return new Response("Verification Error", {status: 401});
		}
		const data = await request.json()
		const order = await getOrderById(data.id);
		if (order.status === "ok") {
			await processOrder(order.response);
			console.log("Pedido processado com sucesso")
			return new Response(`Order correct`, {status: 200});
		}
		return new Response(`Error on webhook`, {status: 500})
	} catch (e) {
		console.error("Erro ao processar pedido: ", e)
		return new Response(`Error on webhook`, {status: 500})
	}
}

