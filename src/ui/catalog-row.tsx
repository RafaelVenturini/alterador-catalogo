import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Rating from '@mui/material/Rating';
import {useCatalog} from "@/product-list-context";
import {UpdateListBody} from "@/util/front-util";

interface Props {
	tiny_id: string;
	name: string,
	sku: string,
	stock: boolean,
	newer: boolean,
	repo: boolean,
	highlight: boolean,
	priority: number,
	img1: string,
}

interface Row {
	id: keyof Props,
	type: 'string' | 'boolean' | 'number',
	db?: 'estoque' | 'novidade' | 'reposicao' | 'destaque' | 'prioridade'
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
	
	const imgStyle = {
		height: '200px'
	}
	
	const imgSpec = 'rounded-lg'
	
	function updateDataBase(x: UpdateListBody) {
		updateItem(x)
	}
	
	function fixImg(sku: string) {
		fetch('/api/consertar-imagens', {
			method: 'POST',
			headers: {'Content-Type': 'application/json',},
			body: JSON.stringify({sku: sku,})
		})
			.then(r => r.json())
			.then(r => console.log(r))
	}
	
	function createRowElement(row: Row, i: number) {
		const key = row.db ?? row.id;
		const valueView = product[row.id];
		
		if (row.type === 'string') {
			return (
				<TableCell sx={sxCell} key={`${row.id} str ${i}`}>
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
	
	return (
		<>
			{rows.map((row, i) => (
				createRowElement(row, i)
			))}
			
			<TableCell>
				<div className="flex flex-row gap-2">
					<img
						src={product.img1}
						alt=''
						className={imgSpec}
						style={imgStyle}
						onError={() => fixImg(product.sku)}
					/>
				</div>
			</TableCell>
		</>
	)
}