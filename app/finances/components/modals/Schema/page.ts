"use client"

import * as z from "zod"; 


export const addTransactionSchema = z.object({
    name: z.string().min(3, "o texto deve ter no mínimo 3 caracteres"),
    amount: z.preprocess((val) => (typeof val === "string" ? val.replace(",", "."): val),
        z.coerce.number().positive("O valor deve ser maior que zero")),
    date: z.string(),

    category_id_select_income: z.string().optional(),
    method_id_select_income: z.string().optional(),
    category_id_tags_income: z.string().optional(),
    method_id_tags_income: z.string().optional(),

    category_id_select_expense: z.string().optional(),
    method_id_select_expense: z.string().optional(),
    category_id_tags_expense: z.string().optional(),
    method_id_tags_expense: z.string().optional(),
})

export type addTransactionSchema = z.infer<typeof addTransactionSchema>