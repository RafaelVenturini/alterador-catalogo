export const palette = {
	primary: '#1f2937',
	secondary: '#111827',
	tertiary: '#4a5568',
	font: {
		active: '#ffffff',
		inactive: '#bdbdbd',
		read: '#d1d5db'
	}
}
export const inputSx = {
	width: '100%',
	'& .MuiInputLabel-root': {
		color: '#807f7f',
	},
	'& label.Mui-focused': {
		color: '#ffffff',
	},
	'& .MuiInputBase-input': {
		color: '#FFF',
	},
	'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: '#FFF',
	},
}

export interface DatabaseCollected {
	tiny_id: string,
	name: string
	sku: string
	img: string
	estoque: boolean
	novidade: boolean
	destaque: boolean
	reposicao: boolean
	prioridade: number
}

export interface NewList {
	tiny_id: string,
	name: string
	sku: string
	img1: string
	img2: string | null
	estoque: boolean
	novidade: boolean
	destaque: boolean
	reposicao: boolean
	prioridade: number
}

export interface UpdateListBody {
	id: string,
	check: boolean,
	value: string,
	tiny_id: string,
}

export interface WebHook {
	cnpj: string;
	idEcommerce: number;
	tipo: string;
	versao: string;
	dados: { idProduto: number | number[] };
}

export interface Produto {
	id: string,
	idMapeamento: string,
	skuMapeamento: string,
	nome: string,
	codigo: string,
	unidade: string,
	preco: string,
	precoPromocional: string,
	ncm: string,
	origem: string,
	gtin: string,
	gtinEmbalagem: string,
	localizacao: string,
	pesoLiquido: string,
	pesoBruto: string,
	estoqueMinimo: string,
	estoqueMaximo: string,
	idFornecedor: string,
	codigoFornecedor: string,
	codigoPeloFornecedor: string,
	unidadePorCaixa: string,
	estoqueAtual: number,
	precoCusto: string
	precoCustoMedio: string
	situacao: string
	descricaoComplementar: string
	obs: string
	garantia: string
	cest: string
	sobEncomenda: string
	marca: string
	tipoEmbalagem: string
	alturaEmbalagem: string
	larguraEmbalagem: string
	comprimentoEmbalagem: string
	diametroEmbalagem: string
	classeProduto: string
	idCategoria: string
	descricaoCategoria: string
	anexos: Anexo[],
}

export interface Anexo {
	url: string,
	nome: string,
	tipo: string
}

export interface TinyProducts {
	id: string,
	nome: string,
	codigo: string,
	unidade: string,
	preco: number,
	preco_promocional: number,
	ncm: string,
	origem: string,
	gtin: string,
	gtin_embalagem: string,
	localizacao: string,
	peso_liquido: number,
	peso_bruto: number,
	estoque_minimo: number,
	estoque_maximo: number,
	id_fornecedor: number,
	nome_fornecedor: string,
	codigo_fornecedor: string,
	codigo_pelo_fornecedor: string,
	unidade_por_caixa: string,
	preco_custo: number,
	preco_custo_medio: number,
	situacao: string,
	tipo: string,
	classe_ipi: string,
	valor_ipi_fixo: string,
	cod_lista_servicos: string,
	descricao_complementar: string,
	garantia: string,
	cest: string,
	obs: string,
	tipoVariacao: string,
	variacoes: string,
	idProdutoPai: string,
	sob_encomenda: string,
	dias_preparacao: string,
	marca: string,
	tipoEmbalagem: string,
	alturaEmbalagem: string,
	comprimentoEmbalagem: string,
	larguraEmbalagem: string,
	diametroEmbalagem: string,
	qtd_volumes: string,
	categoria: string,
	anexos: Anexos[],
	imagens_externas: never[],
	classe_produto: string,
	seo_title: string,
	seo_keywords: string,
	link_video: string,
	seo_description: string,
	slug: string,
}


interface Anexos {
	anexo: string
}