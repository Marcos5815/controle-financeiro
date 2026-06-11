import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

interface LanguageType {
    id: string,
    name: string
}

export const useSelectLanguage = () => {
    const getLanguages = async ():Promise<LanguageType[]> => {
        const { data, error } = await supabase
            .from('languages')
            .select('id, name')
        
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