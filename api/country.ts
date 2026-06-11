import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

interface CountryType {
    id: string,
    name: string
}

export const useSelectCountry = () => {
    const getCountry = async ():Promise<CountryType[]> => {
        const { data, error } = await supabase
            .from('country')
            .select('id, name')
        
        if (error) {
            console.error("Erro ao buscar dados do país: ", error)
            throw new Error(error.message)
        }

        return data
    }

    const query = useQuery({
        queryKey: ["queryCountry"],
        queryFn: getCountry
    })

    return ({
        ...query
    })
}