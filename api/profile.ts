"use client"

import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LanguageType } from "./language"

interface userType {
    id?: string,
    country_id?: string,
    language_id?: LanguageType[],
}

export const useProfile = () => {

    const queryClient = useQueryClient()
    const { user } = useUser()

    const getUser = async ():Promise<userType> => {
        const { data, error } = await supabase
            .from("users")
            .select(`
                id, 
                country_id, 

                language_id (
                    id,
                    name,
                    code
                )
            `)
            .eq("id", user?.id)
            .single()

        if(error) {
            console.log("Erro ao buscar os usuários: ", error)
            throw error
        }

        return data
    }

    const addNewUser = async (formData: string) => {
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
        queryFn: getUser,
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })


    return ({
        ...query,
        mutateUser,
        isMutationUser: mutateUser.isPending,
        isErrorUser: mutateUser.isError,
        mutateUpdateUser: mutateUpdateUser.mutate,
        isMutatingUpdateUser: mutateUpdateUser.isPending,
        isErrorUpdateUser: mutateUpdateUser.isError
    })
}