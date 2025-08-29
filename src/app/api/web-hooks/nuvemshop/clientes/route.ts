import {verifyPost} from "@/util/WebHook/nuvemshop/reusable";
import {
	getClientById
} from "@/util/WebHook/nuvemshop/client/arrange-client";

export async function POST(request: Request) {
	const verified = await verifyPost(request)
	
	if (!verified) {
		return new Response("Unauthorized", {status: 401});
	}
	const data = await request.json();
	
	await getClientById(data.id)
	
	
	return new Response(`Webhook verified: ${verified}`, {status: 200});
}