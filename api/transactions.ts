import { supabase } from "@/lib/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface TransactionsType {
    id?: string,
    user_id: string,
    name: string,
    category_id: string,
    method_id: string,
    date: string,
    type: string,
    amount: number
}

export const deleteTransaction = async (id: string) => {
        const { data, error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id)
            .select()

        if(error) {
            console.log("Erro ao deletar a transação: ", error)
            throw error
        }

        return data
    }

export const useTransactions = (userId:string | null | undefined) => {
    
    const queryClient = useQueryClient()
    
    const getTransactions = async (userId: string) => {
        const { data, error } = await supabase
            .from("transactions")
            .select(`
                id,
                user_id,
                name,
                category_id,
                method_id,
                date,
                type,
                amount,

                method_id (
                    id,
                    method
                ),

                category_id (
                    id,
                    category
                )
            `)
            .eq("user_id", userId)
            .order("date", {ascending: false})

        if(error) {
            console.log("Erro ao buscar as transações: ", error)
            throw error
        }

        return data
    }

    

    const setNewTransactions = async (formData: TransactionsType) => {
        const { data, error } = await supabase
            .from("transactions")
            .insert([formData])
            .select()

        if(error) {
            console.log("Erro ao adicionar transação: ", error)
            throw error
        }

        return data
    }

    const updateTransaction = async (formData: TransactionsType) => {
        
        const { id, ...updateData } = formData
        
        const { data, error } = await supabase
            .from("transactions")
            .update(updateData)
            .eq("id", id)
            .select()

        if(error) {
            console.log("Erro ao atualizar a transação: ", error)
            throw error
        }

        return data

    }



    const mutateDeleteTransactions = useMutation({
        mutationKey: ["mutateDeleteTransactions"],
        mutationFn: (id: string) => deleteTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryTransactions"]})
        }
    })

    const mutateTransactions = useMutation({
        mutationKey: ["mutateTransactions"],
        mutationFn: (formData: TransactionsType) => setNewTransactions(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryTransactions"]})
        }
    })

    const mutateUpdateTransactions = useMutation({
        mutationKey: ["mutateUpdateTransactions"],
        mutationFn: (formData: TransactionsType) => updateTransaction(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["queryTransactions"]})
        }

    })


    const query = useQuery({
        queryKey: ["queryTransactions", userId],
        queryFn: () => getTransactions(userId as string),
        enabled: !!userId,
    })


    return ({
        ...query,
        mutateTransactions: mutateTransactions.mutate,
        isSetTransactionsLoading: mutateTransactions.isPending,
        isSetTransactionsError: mutateTransactions.isError,
        mutateDeleteTransactions: mutateDeleteTransactions.mutate,
        isDeletingTransaction: mutateDeleteTransactions.isPending,
        isDeletingTransactionError: mutateDeleteTransactions.isError,
        mutateUpdateTransactions: mutateUpdateTransactions.mutate,
        isUpdatingTransaction: mutateUpdateTransactions.isPending,
        isUpdatingTransactionError: mutateUpdateTransactions.isError
    })
}