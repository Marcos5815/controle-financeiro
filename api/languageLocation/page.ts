import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const BASE_URL = "http://localhost:5000/LanguageAndLocation"

interface LanguageLocationTypes {
    id: string,
    language?:string,
    location?:string,
    isLanguage: boolean,

}

export const useLanguageLocation = () => {

    const fetchData = async (): Promise<LanguageLocationTypes[]> => {
        try {
            const response = await axios.get(BASE_URL)
            return response.data
        } catch (error) {
            console.log("Erro ao buscar dados sobre o idioma", error)
            throw error
        }
    }

    const query = useQuery({
        queryKey: ["query"],
        queryFn: fetchData
    })


    return {
        ...query
    }
}