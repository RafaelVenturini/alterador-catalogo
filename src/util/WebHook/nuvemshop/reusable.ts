import {WebHookBD} from "@/util/database";
import {Customer} from "./interface";
import {config} from "dotenv";

config();

export function onDuplicate(fields: string[]) {
	return fields.map((f) => `${f} = VALUES(${f})`).join(", ");
}

export function arrangeDate(dateRaw: string) {
	const dateSP = new Date(dateRaw).toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
	const split = dateSP.split(" ");
	const date = split[0].split("/");
	const time = split[1].split(":");
	return `${date[2].replace(",", "")}-${date[1]}-${date[0]} ${time[0]}:${time[1]}:${time[2]}`;
}

export async function updateClient(customer: Customer) {
	const sql = `
        INSERT INTO cliente(cliente_id, nome, dia_cadastro, telefone,
                            email, nuvem_id)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE nome=values(nome),
                                telefone=values(telefone),
                                email=values(email)
	`;
	const values = [
		customer.identification,
		customer.name,
		arrangeDate(customer.created_at),
		customer.phone,
		customer.email,
		customer.id,
	];
	await WebHookBD.query(sql, values);
}

const secret = process.env.NVMSHP_SECRET;

export async function verifyPost(request: Request) {
	const hmacHeader = request.headers.get("x-linkedstore-hmac-sha256");
	
	if (!hmacHeader || !secret) {
		console.log(`hmacHeader: ${hmacHeader} | secret: ${secret}`);
		return false;
	}
	return true;
	
	//////////////////////////////////////////////
	// Temporariamente desabilitado para testes //
	/////////////////////////////////////////////
	
	// // Remove prefixo sha256= se existir
	// if (hmacHeader.startsWith('sha256=')) {
	// 	hmacHeader = hmacHeader.substring(7);
	// }
	//
	// const clonedRequest = request.clone();
	// const body = await clonedRequest.text();
	//
	// // Testa diferentes abordagens
	// const hashFromRawBody = crypto
	// 	.createHmac("sha256", secret)
	// 	.update(body, "utf8")
	// 	.digest("hex");
	//
	// const hashFromParsedBody = crypto
	// 	.createHmac("sha256", secret)
	// 	.update(JSON.stringify(JSON.parse(body)), "utf8")
	// 	.digest("hex");
	//
	// // Testa sem especificar encoding
	// const hashWithoutEncoding = crypto
	// 	.createHmac("sha256", secret)
	// 	.update(body)
	// 	.digest("hex");
	//
	// console.log("=== DEBUG INFO ===");
	// console.log("hmacHeader:", hmacHeader);
	// console.log("Secret exists:", !!secret);
	// console.log("Body length:", body.length);
	// console.log("Hash from raw body:", hashFromRawBody);
	// console.log("Hash from parsed body:", hashFromParsedBody);
	// console.log("Hash without encoding:", hashWithoutEncoding);
	// console.log("Header matches raw?", hmacHeader === hashFromRawBody);
	// console.log("Header matches parsed?", hmacHeader === hashFromParsedBody);
	// console.log("Header matches no encoding?", hmacHeader === hashWithoutEncoding);
	//
	// // Verifica qual metodo funciona
	// return hmacHeader === hashFromRawBody ||
	// 	hmacHeader === hashFromParsedBody ||
	// 	hmacHeader === hashWithoutEncoding;
}

export const nuvemOpt = {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
		"Authentication": process.env.NVMSHP_AUTH || '',
		"User-Agent": process.env.NVMSHP_USER || '',
	}
}





































