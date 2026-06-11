import { supabase } from "@/lib/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ZodUUID } from "zod"

export interface CategoryTypes {
    id?: ZodUUID,
    user_id: string,
    category: string,
    type: string

}

export const useCategory = () =>{

    const queryClient = useQueryClient()

    const getCategory = async () => {
        const { data, error } = await supabase
            .from("category")
            .select("id, category, type")

        if(error) {
            console.log("Erro ao buscar dados do category: ", error)
            throw error
        }

        return data
    }

    const setNewCategory = async (formData: CategoryTypes) => {
        const { data, error } = await supabase
            .from("category")
            .insert([formData])
            .select()

            if(error) {
                console.log("Erro ao enviar dados do category: ", error)
                throw error
            }

            return data[0]
    } 

    const deleteCategory = async (id: string) => {
        const{ data, error } = await supabase
            .from("category")
            .delete()
            .eq("id", id)

        if(error) {
            console.log("Erro ao deletar o category: ", error)
            throw error
        }

        return data
    }

    const updateCategory = async (formData: CategoryTypes) => {
    
            const { id, ...updateData } = formData
    
            const { data, error } = await supabase
                .from("category")
                .update(updateData)
                .eq("id", id)
                .select()
    
            if (error) {
                console.log("Erro ao atualizar o category: ", error)
                throw error
            }
    
            return data
                
        }

    const mutateCategory = useMutation({
        mutationKey: ["mutateCategory"],
        mutationFn: (formData: CategoryTypes) => setNewCategory(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryCategory"]})
        }
    })

    const mutateDeleteCategory = useMutation({
        mutationKey: ["mutateDeleteCategory"],
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryCategory"]})
        }
    })

    const mutateUpdateCategory = useMutation({
        mutationKey: ["mutateUpdateCategory"],
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryCategory"]})
        }
    })

    const query = useQuery({
        queryKey: ["queryCategory"],
        queryFn: getCategory
    })

    return ({
        ...query,
        mutateCategory: mutateCategory.mutate,
        isCategoryLoading: mutateCategory.isPending,
        isCategoryError: mutateCategory.isError,
        mutateDeleteCategory: mutateDeleteCategory.mutate,
        isDeleting: mutateDeleteCategory.isPending,
        isError: mutateDeleteCategory.isError,
        mutateUpdateCategory,
        isUpdating: mutateUpdateCategory.isPending,
        updateError: mutateUpdateCategory.isError
    })

}