import {config} from "dotenv";
import {updateClient} from "../reusable";

config();

const url = process.env.NVMSHOP_URL;

export async function getClientById(clientId: number) {
	try {
		const response = await fetch(`${url}/customers/${clientId}`);
		const data = await response.json();
		await updateClient(data.identification);
	} catch (error) {
		console.error(error);
		return {status: "error", message: error};
	}
}
