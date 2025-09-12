export interface ProductsById {
	id: string;
	nome: string;
	codigo: string;
	unidade: string;
	preco: number,
	preco_promocional: number,
	ncm: string;
	origem: string;
	gtin: string;
	gtin_embalagem: string;
	localizacao: string;
	peso_liquido: number,
	peso_bruto: number,
	estoque_minimo: number,
	estoque_maximo: number,
	id_fornecedor: number,
	nome_fornecedor: string;
	codigo_fornecedor: string;
	codigo_pelo_fornecedor: string;
	unidade_por_caixa: string;
	preco_custo: number,
	preco_custo_medio: number,
	situacao: string;
	tipo: string;
	classe_ipi: string;
	valor_ipi_fixo: string;
	cod_lista_servicos: string;
	descricao_complementar: string;
	garantia: string;
	cest: string;
	obs: string;
	tipoVariacao: string;
	variacoes: string;
	idProdutoPai: string;
	sob_encomenda: string;
	dias_preparacao: string;
	marca: string;
	tipoEmbalagem: string;
	alturaEmbalagem: string;
	comprimentoEmbalagem: string;
	larguraEmbalagem: string;
	diametroEmbalagem: string;
	qtd_volumes: string;
	categoria: string;
	anexos: Anexos[],
	imagens_externas: [],
	classe_produto: string;
	seo_title: string;
	seo_keywords: string;
	link_video: string;
	seo_description: string;
	slug: string;
}


export interface Anexos {
	anexo: string
}