import {nuvemOpt, updateClient} from "../reusable";


export async function getClientById(clientId: number) {
	try {
		const response = await fetch(`https://api.tiendanube.com/v1/4820240/customers/${clientId}`, nuvemOpt);
		const data = await response.json();
		console.log("Cliente: ", data);
		if (data.code === 404) return {
			status: "error",
			message: "ERROR 404 on Arrange Client",
			clientId: clientId
		}
		await updateClient(data);
	} catch (error) {
		console.error(error);
		return {status: "error", message: error};
	}
}
