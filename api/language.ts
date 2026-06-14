import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

export interface LanguageType {
    id: string,
    name: string,
    code: string
}

export const useSelectLanguage = () => {
    const getLanguages = async () => {
        const { data, error } = await supabase
            .from('languages')
            .select('id, name, code')
        
        if (error) {
            console.error("Erro ao buscar dados de idioma: ", error)
            throw new Error(error.message)
        }
        return data
    }

    const query = useQuery({
        queryKey: ["queryLanguage"],
        queryFn: getLanguages
    })

    return({
        ...query
    })
}