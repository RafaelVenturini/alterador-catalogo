export const palette = {
	primary: '#1f2937',
	secondary: '#111827',
	tertiary: '#4a5568',
	font:{
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
export interface DatabaseCollected{
	name: string
	sku: string
	img: string
	estoque: boolean
	novidade: boolean
	destaque: boolean
	reposicao: boolean
	prioridade: number
}
export interface NewList{
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
export interface UpdateListBody{
	id: string,
	check: boolean,
	value: string,
	sku: string,
}