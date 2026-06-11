"use client"

import { supabase } from "@/lib/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface userType {
    id: string,
    country_id: string,
    language_id: string,
}

export const useProfile = () => {

    const queryClient = useQueryClient()

    const getUser = async ():Promise<userType[]> => {
        const { data, error } = await supabase
            .from("users")
            .select(`
                id, 
                country_id, 
                language_id
            `)

        if(error) {
            console.log("Erro ao buscar os usuários: ", error)
            throw error
        }

        return data
    }

    const addNewUser = async (formData: userType) => {
        const { data, error } = await supabase
         .from("users")
         .insert([formData])
         .select()

        if(error) {
            console.log("Error ao salvar o usuário: ", error)
            throw error
        }

        return data
    }

    const updateUser = async (formData: userType) => {

        const { id, ...updateData } = formData

        const { data, error } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", id)
            .select()

        if (error) {
            console.log("Erro ao atualizar o usuário: ", error)
            throw error
        }

        return data
    }

    const mutateUpdateUser = useMutation({
        mutationKey: ["mutateUpdateUser"],
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryUser"]})
        }
    })

    const mutateUser = useMutation({
        mutationKey: ["mutateUser"],
        mutationFn: addNewUser,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryUser"]})
        }
    })

    const query = useQuery({
        queryKey: ["queryUser"],
        queryFn: getUser
    })


    return ({
        ...query,
        mutateUser,
        isMutationUser: mutateUser.isPending,
        isErrorUser: mutateUser.isError,
        mutateUpdateUser,
        isMutatingUpdateUser: mutateUpdateUser.isPending,
        isErrorUpdateUser: mutateUpdateUser.isError
    })
}