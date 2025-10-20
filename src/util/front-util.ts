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
	name: string;
	sku: string;
	img: string;
	estoque: boolean;
	novidade: boolean;
	destaque: boolean;
	reposicao: boolean;
	prioridade: number;
	tamanho: string;
	tipo: string;
	hex: string;
	nome: string;
}

export interface NewList {
	tiny_id: string,
	name: string
	sku: string
	img: string
	estoque: boolean
	novidade: boolean
	destaque: boolean
	reposicao: boolean
	prioridade: number
	categoria: {
		tamanho: string | null;
		tipo: string | null;
	}
	cor: {
		hex: string | null;
		nome: string | null;
	}
}

export interface UpdateListBody {
	id: string,
	check: boolean,
	value: string,
	tiny_id: string,
}