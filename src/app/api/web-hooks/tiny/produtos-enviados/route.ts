interface WebHook{
	cnpj: string;
	idEcommerce: number;
	tipo: string;
	versao: string;
	dados: Produto;
}
interface Produto{
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
interface Anexo{
	url: string,
	nome: string,
	tipo: string
}



export async function POST(req: Request){
	try{
		const body = await req.json()
		const headers = req.headers
		
		console.log("Recebido WebHook: ",body)
		console.log("Headers: ",headers)
		
		return Response.json({status:200})
	}
	catch(e){
		console.log("Erro ao receber WebHook: ",e)
		return Response.json({status:500})
	}
}