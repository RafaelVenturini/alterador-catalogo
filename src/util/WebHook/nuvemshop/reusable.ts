import {WebHookBD} from "@/util/database";
import crypto from "crypto";
import {Customer, WebhookData} from "./interface";
import {config} from "dotenv";

export function verifyWebhook(
	data: WebhookData,
	hmacHeader: string | null,
	secret: string | undefined
): boolean {
	if (!hmacHeader || !secret) return false;
	const hash = crypto.createHmac("sha256", secret).update(JSON.stringify(data)).digest("hex");
	return hmacHeader === hash;
}

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
	WebHookBD.query(sql, values);
}

config();
const APP_SECRET = process.env.NVMSHOP_SECRET;

export async function verifyPost(request: Request) {
	const hmacHeader = request.headers.get("x-linkedstore-hmac-sha256");
	const data: WebhookData = await request.json();
	
	console.log("Received webhook data:", data);
	console.log("Received HMAC header:", hmacHeader);
	
	return verifyWebhook(data, hmacHeader, APP_SECRET);
}








































