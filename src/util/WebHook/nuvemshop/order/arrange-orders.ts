import {
	arrangeDate,
	onDuplicate,
	updateClient
} from "@/util/WebHook/nuvemshop/reusable";
import {
	Address,
	Insert,
	Order,
	OrderItem
} from "@/util/WebHook/nuvemshop/interface";
import {WebHookBD} from "@/util/database";
import {config} from "dotenv";
import {RowDataPacket} from "mysql2/promise";

config();

const url = process.env.NVMSHOP_URL;

export async function getOrderById(orderId: number) {
	try {
		const response = await fetch(`${url}/orders/${orderId}`);
		return {status: "ok", response: await response.json()};
	} catch (error) {
		console.error(error);
		return {status: "error", message: error};
	}
}

const erros: string[] = [];

export async function processOrder(order: Order) {
	const custId = order.customer.identification;
	await updateClient(order.customer);
	const addressId = await updateAddress(order.shipping_address, custId);
	await updateOrder(order, addressId);
	console.log("\n\n\n\n\nErros nos produtos: ", erros);
}

async function updateAddress(address: Address, customerId: string) {
	const select = `SELECT endereco_id
                    FROM endereco
                    WHERE cliente_id = "${customerId}"
                      AND cep = "${address.zipcode}"
                    LIMIT 1`;
	const [rows] = await WebHookBD.execute(select);
	if (Array.isArray(rows) && rows.length > 0) {
		return (rows[0] as RowDataPacket).endereco_id;
	}
	const sql = `
        INSERT INTO endereco(cliente_id, cep, rua, numero, complemento,
                             bairro, cidade, estado, pais, criacao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`;
	const values = [
		customerId,
		address.zipcode,
		address.address,
		address.number,
		address.floor,
		address.locality,
		address.city,
		address.province,
		address.country,
		arrangeDate(address.created_at),
	];
	const x: Insert[] = (await WebHookBD.query(sql, values)) as Insert[];
	return x[0].insertId;
}

async function updateOrder(order: Order, enderecoId: number) {
	const sql = `
        INSERT INTO pedido(pedido_id, endereco_id, cliente_id, frete,
                           subtotal, desconto, total, entregadora,
                           tipo_entrega, plataforma, cod_rastreio,
                           data_pedido, metodo_pagamento, bandeira,
                           parcelamento, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE ${onDuplicate([
            "endereco_id",
            "cliente_id",
            "frete",
            "subtotal",
            "desconto",
            "total",
            "entregadora",
            "tipo_entrega",
            "plataforma",
            "cod_rastreio",
            "data_pedido",
            "metodo_pagamento",
            "bandeira",
            "parcelamento",
            "status",
        ])}
	`;
	const values = [
		order.number,
		enderecoId,
		order.customer.identification,
		order.shipping_cost_customer,
		order.subtotal,
		order.discount,
		order.total,
		order.fulfillments[0].shipping.carrier.name,
		order.fulfillments[0].shipping.option.name,
		order.storefront,
		order.fulfillments[0].tracking_info.code,
		arrangeDate(order.created_at),
		order.payment_details.method,
		order.payment_details.credit_card_company,
		order.payment_details.installments,
		order.status,
	];
	await WebHookBD.execute(sql, values);
	await updateOrderProducts(order.products, order.number);
}

async function updateOrderProducts(products: OrderItem[], pedidoId: number) {
	await WebHookBD.execute(`DELETE
                             FROM pedido_produto
                             WHERE pedido_id = ${pedidoId}`);
	for (const produto of products) {
		const sku = produto.sku;
		const qntd = produto.quantity;
		try {
			const values = [pedidoId, sku, qntd];
			const productSql = `
                INSERT INTO pedido_produto(pedido_id, sku, qntd)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE qntd=values(qntd)
			`;
			
			await WebHookBD.query(productSql, values);
		} catch {
			erros.push(sku);
		}
	}
	if (erros.length > 0) {
		console.log(`\n\n\n\nERROS: ${erros}\n\n\n\n`);
	}
}
