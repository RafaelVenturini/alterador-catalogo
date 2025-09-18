import {config} from "dotenv"
import {Anexos} from "@/util/interfaces";
import {WebHookBD} from "@/util/database";

config()
const token = process.env.TNY_TOKEN

type Sku = string | null

interface DataBaseSkus {
	blu: Sku,
	inf: Sku,
	top: Sku,
	tec: Sku,
	tam: Sku,
	cor: Sku,
	mul: Sku,
}

export async function arrangeSku(skuFull: string) {
	const skuSplit = skuFull.split('-')
	
	let dataBaseSkus: DataBaseSkus = {
		blu: null,
		inf: null,
		top: null,
		tec: null,
		tam: null,
		cor: null,
		mul: null,
	}
	
	if (skuSplit[0] === 'SORT') dataBaseSkus = segmentSkuSort(dataBaseSkus, skuSplit)
	else dataBaseSkus = await segmentSkuCommon(dataBaseSkus, skuSplit)
	
	return dataBaseSkus
}

function segmentSkuSort(segments: DataBaseSkus, split: string[]) {
	switch (split.length) {
		case 3:
			segments.tam = split[2]
			break
		case 4:
			segments.tam = split[2]
			segments.cor = split[3]
			break
		case 5:
			if (split[split.length - 1] === '1') {
				segments.tam = split[2]
				segments.cor = split[3]
			} else {
				segments.inf = split[1]
				segments.top = split[2]
				segments.tec = split[3]
				segments.tam = split[4]
			}
			break
	}
	if (split[1] === 'L') segments.inf = 'LST'
	if (split[1] === 'S') segments.inf = 'SST'
	if (split[1] === 'M') segments.inf = 'MST'
	if (split[1] === 'T') segments.top = 'TST'
	
	return segments
}

async function segmentSkuCommon(segments: DataBaseSkus, split: string[]) {
	switch (split.length) {
		case 4:
			segments.blu = split[0]
			segments.tec = split[1]
			segments.tam = split[2]
			segments.cor = split[3]
			break
		case 5:
			segments.inf = split[0]
			segments.top = split[1]
			segments.tec = split[2]
			segments.tam = split[3]
			
			
			const [mult] = await WebHookBD.execute(`SELECT mult_id
                                                    FROM multcor
                                                    WHERE mult_id = ?`, [split[4]])
			// @ts-expect-error mult[0] pode existir
			if (mult[0]) segments.mul = split[4]
			else segments.cor = split[4]
	}
	return segments
}

export function arrangeImg(img: Anexos[]) {
	return JSON.stringify(img).replaceAll('{"anexo":', '').replaceAll('}', '')
}

export async function pesquisar_id(id: string | number) {
	const linkPesquisa = `https://api.tiny.com.br/api2/produto.obter.php?token=${token}&formato=json&id=${id}`
	const data = await (await fetch(linkPesquisa)).json()
	return data.retorno.produto
}


const x = arrangeSku('TRI-NIN-SED-TU-340')
console.log(x)



















