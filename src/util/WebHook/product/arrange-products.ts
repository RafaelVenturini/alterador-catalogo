import {WebHookBD} from '@/util/database'
import {config} from "dotenv"

config()

const token = process.env.TNY_TOKEN

export function arrangeSku(skuFull: string, name: string) {
	const skuSeg = skuFull.split('-')
	
	let blu = null
	let cor = null
	let inf = null
	let mul = null
	let tec = null
	let top = null
	let tam = null
	
	if (skuSeg[0] === 'SORT' || skuSeg[0] === 'SRT') {
		tam = skuSeg.includes('TU') ? 'TU' : 'TP'
	} else if (skuSeg.length === 4) {
		if (skuSeg[0][0] === 'L' || skuSeg[0][0] === 'S') {
			inf = skuSeg[0]
			tec = skuSeg[1]
			tam = skuSeg[2]
			cor = skuSeg[3]
		} else {
			blu = skuSeg[0]
			tec = skuSeg[1]
			tam = skuSeg[2]
			cor = skuSeg[3]
		}
		
	} else if (skuSeg.length === 5) {
		inf = skuSeg[0]
		top = skuSeg[1]
		tec = skuSeg[2]
		tam = skuSeg[3]
		if (name.split(' ').includes('Bicolor')) {
			mul = skuSeg[4]
		} else if (name.split(' ').includes('Tricolor')) {
			mul = skuSeg[4]
		} else {
			cor = skuSeg[4]
		}
	}
	return {
		blu: blu,
		inf: inf,
		top: top,
		tec: tec,
		tam: tam,
		cor: cor,
		mul: mul,
	}
}

export function arrangeImg(img: string) {
	return JSON.stringify(img).replaceAll('{"anexo":', '').replaceAll('}', '')
}

interface QueryPLCA {
	plca_id: number;
}

export async function plcaId(peso: string | number, largura: string | number, comprimento: string | number, altura: string | number) {
	const plcaRows = await WebHookBD.execute(`
        SELECT plca_id
        FROM plca
        WHERE peso = ?
          AND largura = ?
          AND comprimento = ?
          AND altura = ?
	`, [peso, largura, comprimento, altura])
	
	// @ts-expect-error rows exists
	const plcaRow: QueryPLCA = plcaRows.rows[0]
	
	let plca = 13
	
	if (plcaRow && plcaRow.plca_id) {
		plca = plcaRow.plca_id
	}
	
	return plca
}

export async function pesquisar_id(id: string | number) {
	const linkPesquisa = `https://api.tiny.com.br/api2/produto.obter.php?token=${token}&formato=json&id=${id}`
	const data = await (await fetch(linkPesquisa)).json()
	return data.retorno.produto
}