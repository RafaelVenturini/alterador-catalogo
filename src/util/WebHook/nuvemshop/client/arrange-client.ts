import {nuvemOpt, updateClient} from "../reusable";
import {Customer} from "@/util/WebHook/nuvemshop/interface";


export async function getClientById(clientId: number) {
	try {
		const response = await fetch(`https://api.tiendanube.com/v1/4820240/customers/${clientId}`, nuvemOpt);
		const data: Customer = await response.json();
		if (data.code === 404) return {
			status: "error",
			message: "ERROR 404 on Arrange Client",
			clientId: clientId
		}
		if (data.identification === null) return {
			status: "error",
			message: "The customer did not register their CPF or CNPJ",
			clientId: clientId
		}
		console.log("Cliente: ", clientId);
		await updateClient(data);
	} catch (error) {
		console.error(error);
		return {status: "error", message: error};
	}
}
