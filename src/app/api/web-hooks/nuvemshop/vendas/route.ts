import {
	getOrderById,
	processOrder
} from "@/util/WebHook/nuvemshop/order/arrange-orders";
import {verifyPost} from "@/util/WebHook/nuvemshop/reusable";

export async function POST(request: Request) {
	const verified = await verifyPost(request)
	
	if (!verified) {
		return new Response("Unauthorized", {status: 401});
	}
	const data = await request.json();
	const order = await getOrderById(data.id);
	if (order.status === "ok") {
		await processOrder(order.response);
	}
	
	return new Response(`Webhook verified: ${verified}`, {status: 200});
}

