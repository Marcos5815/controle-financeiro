import { supabase } from "@/lib/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface MethodTypes {
    id?: string,
    user_id: string,
    method: string,
    type: string

}

export const useMethod = () =>{

    const queryClient = useQueryClient()

    const getMethod = async () => {
        const { data, error } = await supabase
            .from("method")
            .select("id, type, method")

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

    const updateMethod = async (formData: MethodTypes) => {

        const { id, ...updateData } = formData

        const { data, error } = await supabase
            .from("method")
            .update(updateData)
            .eq("id", id)
            .select()

        if (error) {
            console.log("Erro ao atualizar o method: ", error)
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

    const mutateUpdateMethod = useMutation({
        mutationKey: ["mutateUpdateMethod"],
        mutationFn: (formData: MethodTypes) => updateMethod(formData),
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
        mutateUpdateMethod,
        isUpdating: mutateUpdateMethod.isPending,
        updateError: mutateUpdateMethod.isError

    })

}