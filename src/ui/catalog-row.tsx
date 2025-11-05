import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Rating from '@mui/material/Rating';
import {useCatalog} from "@/product-list-context";
import {fixImg, UpdateListBody} from "@/util/front-util";
import Image from "next/image";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";

interface Props {
	tiny_id: string;
	name: string,
	sku: string,
	stock: boolean,
	newer: boolean,
	repo: boolean,
	highlight: boolean,
	priority: number,
	img: string,
	color: {
		hex: string | null,
		nome: string | null,
	},
	category: {
		tamanho: string | null,
		tipo: string | null,
	}
}

interface Row {
	id: keyof Props,
	type: 'string' | 'boolean' | 'number',
	db?: 'estoque' | 'novidade' | 'reposicao' | 'destaque' | 'prioridade'
}

function colorizeBubble(hex: string | null) {
	let bgColor = ''
	let bg = ''
	if (hex) {
		const splitHex = hex.split(',').map(x => '#' + x)
		if (splitHex.length === 1) {
			bgColor = splitHex[0]
		} else if (splitHex.length === 2) {
			bg = `linear-gradient(145deg, ${splitHex[0]} 50%, ${splitHex[1]} 50%)`
		} else if (splitHex.length === 3) {
			bg = `conic-gradient(${splitHex[0]} 0deg 120deg,${splitHex[1]} 120deg 240deg,${splitHex[2]} 240deg 360deg)`
		}
	}
	return {background: bg, backgroundColor: bgColor,}
}

export default function CatalogRow(product: Props) {
	
	const {updateItem} = useCatalog()
	const rows: Row[] = [
		{id: 'name', type: 'string',},
		{id: 'sku', type: 'string',},
		{id: 'stock', type: 'boolean', db: 'estoque'},
		{id: 'newer', type: 'boolean', db: 'novidade'},
		{id: 'repo', type: 'boolean', db: 'reposicao'},
		{id: 'highlight', type: 'boolean', db: 'destaque'},
		{id: 'priority', type: 'number', db: 'prioridade'},
	]
	
	const sxCell = {
		typography: {
			fontSize: '18px',
		},
		'& .MuiSvgIcon-root': {fontSize: 28},
		
	}
	
	const imgSpec = 'rounded-lg'
	
	function updateDataBase(x: UpdateListBody) {
		updateItem(x)
	}
	
	function createRowElement(row: Row, i: number) {
		const key = row.db ?? row.id;
		const valueView = product[row.id];
		
		if (row.type === 'string') {
			return (
				<TableCell
					sx={sxCell}
					key={`${row.id} str ${i}`}
				>
					{/*// @ts-expect-error tá funcionando*/}
					{product[row.id]}
				</TableCell>
			)
		} else if (row.type === 'boolean') {
			return (
				<TableCell sx={sxCell} key={`${row.id} bool ${i}`}>
					<Checkbox
						name={String(key)}
						checked={Boolean(valueView)}
						onChange={(e) => {
							updateDataBase(
								{
									id: String(key),
									value: e.target.value,
									check: e.target.checked,
									tiny_id: product.tiny_id,
								}
							)
						}}
					/>
				</TableCell>
			)
		} else {
			return (
				<TableCell key={`${row.id} num ${i}`} sx={sxCell}>
					<Rating
						size='large'
						name={String(key)}
						value={Number(valueView)}
						onChange={(_e, value) => {
							updateDataBase(
								{
									id: String(key),
									tiny_id: product.tiny_id,
									value: String(value) || '0',
									check: false,
								}
							)
						}}
					/>
				</TableCell>
			)
		}
	}
	
	const {background, backgroundColor} = colorizeBubble(product.color.hex)
	return (
		<>
			{rows.map((row, i) => (
				createRowElement(row, i)
			))}
			
			<TableCell>
				<div className="flex flex-row gap-2">
					<Image
						height={100}
						width={100}
						src={product.img || "/toque.webp"}
						alt=''
						className={imgSpec}
						onError={() => {
							console.log('Error loading image')
						}}
						onClick={() => fixImg(product.tiny_id)}
					/>
					<Box
						sx={{
							width: 100,
							height: 100,
							borderRadius: '0.75rem',
							color: product.color.hex ? '#ffffff' : '#000000',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							backgroundColor: backgroundColor,
							background: background,
						}}
					>
						<Typography
							sx={{
								textShadow: '1px 1px 0px #000000',
							}}
						>
							{product.color.nome ? product.color.nome : 'Sem cor'}
						</Typography>
					</Box>
				</div>
			</TableCell>
		</>
	)
}