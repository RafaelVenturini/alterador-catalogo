import {WebHookBD} from "@/util/database";
import {pesquisar_id} from "@/util/WebHook/product/arrange-products";
import {TinyProducts} from "@/util/front-util";

export async function updateItens() {
	let erros = 0
	const ids = await getDatabaseItens()
	for (const id of ids) {
		const res: TinyProducts = await pesquisar_id(id)
		if (res.anexos.length > 0) {
			const anexo = JSON.stringify(res.anexos).replaceAll('{"anexo":', '').replaceAll('}', '')
			const sql = `UPDATE produto
                         SET img = ?
                         WHERE tiny_id = ?`
			await WebHookBD.execute(sql, [anexo, id])
			
		} else {
			erros++
		}
	}
	return {erros: erros, success: ids.length - erros}
}

async function getDatabaseItens() {
	const sql = `SELECT tiny_id
                 FROM produto
                 WHERE img = '[]'`
	const [rows] = await WebHookBD.execute(sql)
	// @ts-expect-error map vem de array methods
	return rows.map(r => r.tiny_id)
}