"use client";

import { Box, Button, FormControl, Input, InputLabel, MenuItem, Modal, Paper, Select, Typography, useAutocomplete } from "@mui/material"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTransactionSchema } from "../Schema";
import { InputTags } from "../../InputTags";
import { useLanguage } from "@/contexts/languageContext";
import { TransactionsType, useTransactions } from "@/api/transactions";
import { MethodTypes, useMethod } from "@/api/method";
import { useAuth } from "@clerk/nextjs";
import { CategoryTypes, useCategory } from "@/api/category";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


interface TransactionModalProps {
    open: boolean;
    onClose: () => void;
    transactionToEdit?: TransactionsType | null;
}


export const IncomeModal = ({ open, onClose, transactionToEdit }: TransactionModalProps) => {

    const { userId } = useAuth()
    const { 
            mutateTransactions, 
            mutateUpdateTransactions,
            isUpdatingTransaction
         } = useTransactions(userId)
    const {
        data: queryMethod,
        mutateMethod,
        mutateDeleteMethod,
      } = useMethod();
    const {
        data: queryCategory,
        mutateCategory,
        mutateDeleteCategory
    } = useCategory();
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(addTransactionSchema),
        mode: "onChange",
        defaultValues: {
            category_id_select_income: "",
            method_id_select_income: "",
        }
    })
    const [ inputCategoryTagsOpen, setInputCategoryTagsOpen ] = useState(false)
    const [ inputMethodTagsOpen, setInputMethodTagsOpen ] = useState(false)
    const {t} = useLanguage()
    const handleCategoryInputTagsOpen = () => {
        setInputCategoryTagsOpen((prev) => !prev)
    }

    const handleMethodInputTagsOpen = () => {
        setInputMethodTagsOpen((prev) => !prev)
    }


    useEffect(() => {
            if (open) {
                if(transactionToEdit) {
                    console.log(transactionToEdit.category_id)
                    reset({
                        ...transactionToEdit,
                        date: transactionToEdit.date?.slice(0, 10) || "",
                        method_id_select_income: typeof transactionToEdit.method_id === 'object' 
                        ? (transactionToEdit.method_id as { id: string })?.id 
                        : transactionToEdit.method_id,

                        category_id_select_income: typeof transactionToEdit.category_id === 'object' 
                        ? (transactionToEdit.category_id as { id: string })?.id 
                        : transactionToEdit.category_id,
                        
                    });
                } else {
                    reset({ 
                        name: "",
                        amount: "",           
                        category_id_select_income: "",
                        method_id_select_income: "",
                        date: "",
                    })
                }
            }
        }, [transactionToEdit, reset, open])



    const handleOnSubmit = (formData: addTransactionSchema) => {

        if(!userId) return;

        const cleanUUID = (value: string | undefined | null) => {
            return value && value.trim() !== "" ? value : null;
        };
        
        const formattedData = {
            name: formData.name,
            amount: Number(formData.amount),
            date: formData.date,
            category_id: cleanUUID(formData.category_id_select_income)!,
            method_id: cleanUUID(formData.method_id_select_income)!,
            user_id: userId as string,
            type:"income",
        }

        if (transactionToEdit) {
            const fullData = {
                id: transactionToEdit.id,
                ...formattedData
            }

            mutateUpdateTransactions(fullData, {
                onSuccess: () => {
                    onClose()
                    reset()
                },
                onError: (error) => {
                    console.log("Erro ao atualizar transação no IncomeModal: ", error)
                }
            });
        } else {
            const fullData = {
                ...formattedData
            }

            mutateTransactions(fullData, {
                onSuccess: () => {
                    onClose()
                    reset()
                },
                onError: (error) => {
                    console.log("Erro ao salvar: ", error)
                }
            })
        }
    }

    const handleSubmitCategory = (formData: CategoryTypes) => {
        
        mutateCategory(formData, {
            onSuccess: () => {
                console.log("Categoria adicionada com sucessso")
            },

            onError: (error) => {
                console.log("Erro ao salvar a categoria", error)
            }
        })
    }

    const handleSubmitMethod = (formData: MethodTypes) => {
        mutateMethod(formData, {
            onSuccess: () => {
                console.log("Metodo adicionado com sucessso")
            },

            onError: (error) => {
                console.log("Erro ao salvar os métodos: ", error)
            } 
        })
    }


    return (
        <Box>            
            <Modal
                open={open}
                onClose={onClose}
                className="flex flex-col justify-center items-center"
            >
                <Box component="form" onSubmit={handleSubmit(handleOnSubmit, (errors) => {
                    console.log("erro no onSubmit", errors)
                })} className="w-[80%] h-[90%] sm:w-140 sm:h-150 text-center" sx={{bgcolor: "background01.main"}}>
                    
                    <Box className="flex justify-end ml-5 mt-2">
                        <Button onClick={onClose}><CloseIcon /></Button>
                    </Box>
                    <Box  className="flex flex-col items-start sm:grid sm:grid-rows-2 sm:grid-cols-6 mx-10 gap-10">
                        <Typography variant="h5" className="sm:col-span-6">
                            {transactionToEdit ? t("editEntrance") : t("addEntrance")} 
                        </Typography>
                        <FormControl className="sm:col-span-3">
                            <InputLabel htmlFor="name"><Typography color="typography01">{t("name")}</Typography></InputLabel>
                            <Input required {...register("name")} autoComplete="off" id="name" />
                            {errors.name && (
                                <Typography variant="caption" color="error">
                                    {errors.name.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl className="sm:col-span-2">
                            <InputLabel htmlFor="amount"><Typography color="typography01">{t("amount")}</Typography></InputLabel>
                            <Input required {...register("amount")} id="amount"/>
                            {errors.amount && (
                                <Typography variant="caption" color="error">
                                    {errors.amount.message}
                                </Typography>
                            )}
                        </FormControl>


                        <FormControl variant="filled" className="sm:col-span-3">
                            <Box className="flex items-center mr-3!">
                                <InputLabel><Typography color="typography01">{t("category")}</Typography></InputLabel>
                                <Controller
                                    name="category_id_select_income"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            className="min-w-full"
                                            label="Categoria"
                                            required
                                            value={field.value || ""}
                                        >
                                            {queryCategory?.map((datas) => (
                                                datas.type === "income" &&
                                                    <MenuItem key={datas.id} value={datas.id}>{datas.category}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                <Button onClick={handleCategoryInputTagsOpen} className="h-10!">
                                    <AddCircleOutlineIcon sx={{color: "typography01.main"}}/>
                                </Button>
                            </Box>
                        </FormControl>
                        <FormControl className="sm:col-span-2 md:ml-5!" variant="filled">
                            <Box className="flex items-center">
                                <InputLabel><Typography color="typography01">{t("method")}</Typography></InputLabel>
                                <Controller 
                                    name="method_id_select_income"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            { ...field }
                                            className="min-w-full"
                                            label="Método"
                                            required
                                            value={field.value || ""}
                                        >
                                            {queryMethod?.map((datas) => (
                                                datas.type === "income" &&
                                                    <MenuItem key={datas.id} value={datas.id}>{datas.method}</MenuItem>
                                            ))}
                                            
                                        </Select>
                                    )}
                                />

                                <Button onClick={handleMethodInputTagsOpen} className="h-10!">
                                    <AddCircleOutlineIcon sx={{color: "typography01.main"}}/>
                                </Button>
                            </Box>
                        </FormControl>
                        <FormControl className="sm:col-span-2 w-39!">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Controller 
                                        name="date"
                                        control={control}
                                        rules={{ required: "A data é obrigatória"}}
                                        render={({field: { onChange, value }}) => (
                                            <DatePicker 
                                            format="DD/MM/YYYY"
                                            label={`${t("date")}`}
                                            value={value ? dayjs(value) : null} 
                                            onChange={(newValue) => {
                                                const formattedDate = newValue ? newValue.format("YYYY-MM-DD") : ""
                                                onChange(formattedDate)
                                            }}
                                           
                                            slotProps={{
                                                textField: {
                                                    sx: { 
                                                        color: "typography01.main",
                                                        '& .MuiInputBase-input': {
                                                             color: "typography01.main",},
                                                     }
                                                }
                                            }}
                                        />
                                        )}
                                    />
                                    
                            </LocalizationProvider>
                        </FormControl>
                        <Button className="self-center sm:col-end-4 sm:row-end-9 w-25! h-10!" 
                            type="submit" 
                            variant="contained" 
                            disabled={isUpdatingTransaction}
                        >
                            {t("submit")}
                        </Button>
                    </Box>
                    <Controller 
                        name="category_id_tags_income"
                        control={control}
                        render={({ field }) => {
                            
                            const safeValue = Array.isArray(queryCategory) ? queryCategory : [];
                            const currentItem = safeValue.filter((item) => {
                                return item.type === "income"
                            }
                                
                            )
                            const tagValues = currentItem.map((item) => item.category)
                            return (
                                <InputTags 
                                    open={inputCategoryTagsOpen}
                                    onClose={() => setInputCategoryTagsOpen(false)}
                                    value={tagValues}
                                    onChange={(newNames) => {
                                        if (newNames.length < tagValues.length) {
                                            const removedName = tagValues.find(name => !newNames.includes(name));
                                            const itemToRemove = currentItem.find(item => item.category === removedName);

                                            if(removedName) {
                                                mutateDeleteCategory(itemToRemove?.id)
                                            }
                                        } else {
                                            const addedName = newNames[newNames.length - 1];
                                            const newObj = {
                                                user_id: userId as string,
                                                category: addedName,
                                                type: "income"
                                            };

                                            handleSubmitCategory(newObj)
                                        }
                                    }}
                            />
                            )
                        }}

                    />
                    <Controller 
                        name="method_id_tags_income"
                        control={control}
                        render={({ field }) => {
                            
                            const safeValue = Array.isArray(queryMethod) ? queryMethod : [];
                            const currentItem = safeValue.filter((item) => {
                                return item.type === "income"
                            }
                                
                            )
                            const tagValues = currentItem.map((item) => item.method)
                            return (
                                <InputTags 
                                    open={inputMethodTagsOpen}
                                    onClose={() => setInputMethodTagsOpen(false)}
                                    value={tagValues}
                                    onChange={(newNames) => {
                                        if (newNames.length < tagValues.length) {
                                            const removedName = tagValues.find(name => !newNames.includes(name));
                                            const itemToRemove = currentItem.find(item => item.method === removedName);

                                            if(removedName) {
                                                mutateDeleteMethod(itemToRemove?.id)
                                            }
                                        } else {
                                            const addedName = newNames[newNames.length - 1];
                                            const newObj = {
                                                user_id: userId as string,
                                                method: addedName,
                                                type: "income"
                                            };

                                            handleSubmitMethod(newObj)
                                        }
                                    }}
                            />
                            )
                        }}

                    />
                </Box>
            </Modal>
        </Box>
    )
}

