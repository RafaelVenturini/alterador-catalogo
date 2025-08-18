"use client"

import CatalogRow from "./catalog-row";
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import React, {useEffect, useState} from "react";
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {Autocomplete, Checkbox, Typography} from "@mui/material";
import {
	inputSx,
	NewList,
	palette
} from "@/util/front-util";
import {TableVirtuoso} from "react-virtuoso";
import {useCatalog} from "@/product-list-context";

interface FilterList {
	stock: boolean,
	newer: boolean,
	highlight: boolean,
	reposition: boolean,
	priority: boolean,
	word: string,
	category: {label:string, id:number},
}

export default function CatalogTable() {
	const {items} = useCatalog()
	const [filterList, setFilterList] = useState<FilterList>({
		stock: false,
		newer: false,
		highlight: false,
		reposition: false,
		priority: false,
		word: '',
		category: {label:'Todos', id:0},
	})
	const [rows, setRows] = useState<NewList[]>([])
	
	useEffect(() => {
		const plus = ['-TP-','-G-',"-GG-"]
		const unico = ['-TU-','-P-',"-M-"]
		
		let filtred = items
		if (filterList.category.id > 0){
			if (filterList.category.id % 2 === 0) filtred = filtred.filter((x) => plus.some(tamanho => x.sku.includes(tamanho)))
			else filtred = filtred.filter((x) => unico.some(tamanho => x.sku.includes(tamanho)))
			
			if ([1,2].includes(filterList.category.id)) filtred = filtred.filter((x) => x.sku[0] === 'L')
			if ([3,4].includes(filterList.category.id)) filtred = filtred.filter((x) => x.sku[0] === 'S')
			if ([5,6].includes(filterList.category.id)) filtred = filtred.filter((x) => x.sku[0] === 'M')
			if ([7,8].includes(filterList.category.id)) filtred = filtred.filter((x) => ['R','C','B'].includes(x.sku[0]))
		}
		
		
		if (filterList.stock)       filtred = filtred.filter((x) => x.estoque)
		if (filterList.newer)       filtred = filtred.filter((x) => x.novidade)
		if (filterList.highlight)   filtred = filtred.filter((x) => x.destaque)
		if (filterList.reposition)  filtred = filtred.filter((x) => x.reposicao)
		if (filterList.priority)    filtred = filtred.sort((a, b) => b.prioridade - a.prioridade)
		else                        filtred = filtred.sort((a, b) => a.name.localeCompare(b.name))
		
		filtred = filtred.filter((x) => {
			if (!filterList.word || filterList.word.length <= 1) return true;
			
			return x.name.toLowerCase().includes(filterList.word.toLowerCase()) ||
				x.sku.toLowerCase().includes(filterList.word.toLowerCase());
		})
		setRows(filtred)
	}, [filterList, items]);
	
	
	const headers = () => (
		<TableHead sx={{borderBottom: `2px solid ${palette.tertiary}`}}>
			<TableRow>
				<TableCell sx={{width: '20%'}}>Nome</TableCell>
				<TableCell sx={{width: '20%'}}>SKU</TableCell>
				<TableCell sx={{width: '5%'}} >Estoque</TableCell>
				<TableCell sx={{width: '5%'}} >Novidade</TableCell>
				<TableCell sx={{width: '5%'}} >Reposição</TableCell>
				<TableCell sx={{width: '5%'}} >Destaque</TableCell>
				<TableCell >Prioridade</TableCell>
				<TableCell sx={{width: '25%'}} >Preview</TableCell>
			</TableRow>
		</TableHead>
	)
	
	const checks = [
		{label: 'Estoque'    , value: 'stock'}      ,
		{label: 'Novidade'   , value: 'newer'}      ,
		{label: 'Reposição'  , value: 'reposition'} ,
		{label: 'Destaque'   , value: 'highlight'}  ,
		{label: 'Prioridade' , value: 'priority'}   ,
	]
	
	const selectOpts = [
		{label:'Todos'                      , id:0} ,
		{label:'Legging Única'              , id:1} ,
		{label:'Legging Plus'               , id:2} ,
		{label:'Short Único'                , id:3} ,
		{label:'Short Plus'                 , id:4} ,
		{label:'Macacão & Macaquinho Único' , id:5} ,
		{label:'Macacão & Macaquinho Plus'  , id:6} ,
		{label:'Blusas & Regatas Único'     , id:7} ,
		{label:'Blusas & Regatas Plus'      , id:8}
	]
	
	return(
		<Box sx={{width: '100%', height: '100%'}}>
			<Box className="grid grid-cols-3 gap-2 place-items-center" sx={{height: 100}}>
				<TextField
					onChange={(event) => {
						setFilterList((prev) => ({...prev, word: event.target.value}));
					}}
					label="Pesquisar..."
					sx={inputSx}
				/>
				<Box className="grid grid-cols-5 gap-3 place-items-center">
					{ checks.map((x) => (
						<Box className="grid grid-cols-1 place-items-center" key={x.value}>
							<Typography sx={{color:palette.font.read}}>{x.label}</Typography>
							<Checkbox
								name={x.value}
								defaultChecked={false}
								onChange={(e) =>{
									setFilterList((prev) => ({...prev, [x.value]: e.target.checked}))
								}}
							/>
						</Box>
					))}
				</Box>
				<Autocomplete
					disablePortal
					options={selectOpts}
					onChange={(_event, newValue: {label:string, id:number} | null) => {
						setFilterList((prevState) => ({
							...prevState,
							category: newValue || {label:'Todos', id:0},
						}))
						console.log(filterList)
					}}
					sx={inputSx}
					renderInput={(params) => <TextField {...params} label="Categoria" placeholder={"Selecione uma categoria..."}/>}
				/>
			
			</Box>
			<Paper sx={{ height: 800, width: "100%", mt: 2}}>
				<TableVirtuoso
					data={rows}
					fixedHeaderContent={headers}
					components={{
						Table: (props) => (
							<Table {...props} stickyHeader aria-label="virtualized table" />
						),
						TableHead: headers,
						TableBody: React.forwardRef(function TableBody(props, ref) {
							return <tbody ref={ref} {...props} />;
						}),
					}}
					itemContent={(_index, item) =>
						<CatalogRow
							name={item.name}
							sku={item.sku}
							stock={item.estoque}
							newer={item.novidade}
							repo={item.reposicao}
							highlight={item.destaque}
							priority={item.prioridade}
							img1={item.img1}
							img2={item.img2}
						/>
					}
				/>
			</Paper>
		</Box>
	
	)
}
