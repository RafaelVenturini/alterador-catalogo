"use client"

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from "react";
import {
	DatabaseCollected,
	NewList,
	UpdateListBody
} from "@/util/front-util";

interface CatalogContext {
	items: NewList[];
	loading: boolean;
	updateItem: (body: UpdateListBody) => void;
}


const CatalogoContext = createContext<CatalogContext | undefined>(undefined)

export function CatalogProvider({children}: { children: ReactNode }) {
	const [items, setItems] = useState<NewList[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	
	const fetchCatalog = async () => {
		fetch('/api/coletar-catalogo')
			.then(res => res.json())
			.then((res: DatabaseCollected[]) => {
				const newList: NewList[] = res.map(x => {
					const imgList = x.img
						.replaceAll('"', '')
						.replaceAll('[', '')
						.replaceAll(']', '')
						.split(',')
					let img2 = null
					if (imgList.length > 1) {
						img2 = imgList[1]
					}
					return {
						...x,
						img1: imgList[0],
						img2: img2
					}
				})
				setItems(newList)
			})
	}
	
	useEffect(() => {
		fetchCatalog().then(() => setLoading(false))
	}, [])
	
	const updateItem = async (body: UpdateListBody) => {
		await fetch('/api/atualizar-catalogo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				body
			})
		})
		
		setItems(prev => prev.map(x => {
			if (x.tiny_id === body.tiny_id) {
				const updates: Partial<NewList> = {}
				
				if (body.id === 'estoque') updates.estoque = body.check
				else if (body.id === 'novidade') updates.novidade = body.check
				else if (body.id === 'reposicao') updates.reposicao = body.check
				else if (body.id === 'destaque') updates.destaque = body.check
				else if (body.id === 'prioridade') updates.prioridade = parseInt(body.value) || 0
				
				return {...x, ...updates}
			}
			return x
		}))
	}
	
	return (
		<CatalogoContext.Provider value={{items, updateItem, loading}}>
			{children}
		</CatalogoContext.Provider>
	)
}

export function useCatalog() {
	const context = useContext(CatalogoContext)
	if (!context) throw new Error('useCatalog must be used within a CatalogProvider')
	return context
}