import { supabase } from "@/lib/supabase"
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface MethodTypes {
    id?: string,
    user_id: string,
    method: string,
    type: string

}

export const useMethod = () =>{

    const { userId } = useAuth()
    const queryClient = useQueryClient()

    const getMethod = async () => {
        if(!userId) return []

        const { data, error } = await supabase
            .from("method")
            .select("id, type, method")
            .eq("user_id", userId)

        if(error) {
            console.log("Erro ao buscar dados do Method: ", error)
            throw error
        }

        return data
    }

    const setNewMethod = async (formData: MethodTypes) => {
        const { data, error } = await supabase
            .from("method")
            .insert([formData])
            .select()

            if(error) {
                console.log("Erro ao enviar dados do Method: ", error)
                throw error
            }

            return data[0]
    } 

    const deleteMethod = async (id: string) => {
        const{ data, error } = await supabase
            .from("method")
            .delete()
            .eq("id", id)

        if(error) {
            console.log("Erro ao deletar o method: ", error)
            throw error
        }

        return data
    }

    const mutateMethod = useMutation({
        mutationKey: ["mutateMethod"],
        mutationFn: (formData: MethodTypes) => setNewMethod(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryMethod"]})
        }
    })

    const mutateDeleteMethod = useMutation({
        mutationKey: ["mutateDeleteMethod"],
        mutationFn: (id: string) => deleteMethod(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryMethod"]})
        }
    })


    const query = useQuery({
        queryKey: ["queryMethod"],
        queryFn: getMethod
    })

    return ({
        ...query,
        mutateMethod: mutateMethod.mutate,
        isGetMethodLoading: mutateMethod.isPending,
        isGetMethodError: mutateMethod.isError,
        mutateDeleteMethod: mutateDeleteMethod.mutate,
        isDeleting: mutateDeleteMethod.isPending,
        deleteError: mutateDeleteMethod.isError,

    })

}