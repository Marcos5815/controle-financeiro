"use client";

import { useAuth } from "@clerk/nextjs";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTransactionSchema } from "../Schema/page";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { InputTags } from "../../InputTags/page";
import { uuidv4 } from "zod";
import { useLanguage } from "@/contexts/languageContext/page";
import { TransactionsType, useTransactions } from "@/api/transactions";
import { MethodTypes, useMethod } from "@/api/method";
import { CategoryTypes, useCategory } from "@/api/category";

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  transactionToEdit: TransactionsType | null;
}

export const ExpenseModal = ({
  open,
  onClose,
  transactionToEdit,
}: ExpenseModalProps) => {

  const { userId } = useAuth()
  const {
    data: queryMethod,
    mutateMethod,
    mutateDeleteMethod,
  } = useMethod();

  const {
    data: queryCategory,
    mutateCategory,
    mutateDeleteCategory
  } = useCategory()
  const { mutateTransactions, mutateUpdateTransactions } = useTransactions(userId);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addTransactionSchema),
    mode: "onChange",
    defaultValues: {
        category_id_select_expense: "",
        method_id_select_expense: "",
    },
  });
  

  const [inputCategoryTagsOpen, setInputCategoryTagsOpen] = useState(false);
  const [inputMethodTagsOpen, setInputMethodTagsOpen] = useState(false);

  const {t} = useLanguage()

  const handleCategoryInputTagsOpen = () => {
    setInputCategoryTagsOpen((prev) => !prev);
  };

  const handleMethodInputTagsOpen = () => {
    setInputMethodTagsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (open) {
      if (transactionToEdit) {
        reset({
          ...transactionToEdit,
          date: transactionToEdit.date?.slice(0, 10) || "",
          method_id_select_expense: typeof transactionToEdit.method_id === "object"
          ? (transactionToEdit.method_id as { id: string })?.id
          : transactionToEdit.method_id,

          category_id_select_expense: typeof transactionToEdit.category_id === "object"
          ? (transactionToEdit.category_id as { id: string })?.id
          : transactionToEdit.category_id
        });
      } else {
        reset({
          name: "",
          amount: "",
          date: "",
          category_id_select_expense: "",
          method_id_select_expense: "",
        });
      }
    }
  }, [transactionToEdit, reset, open]);

  const handleOnSubmit = (formData: addTransactionSchema) => {
    
    if(!userId) return;

    const cleanUUID = (value: string | undefined | null) => {
          return value && value.trim() !== "" ? value : null;
      };

    const formattedData = {
      name: formData.name,
      amount: Number(formData.amount),
      date: formData.date,
      category_id: cleanUUID(formData.category_id_select_expense)!,
      method_id: cleanUUID(formData.method_id_select_expense)!,
      user_id: userId as string,
      type:"expense",
    }

    if (transactionToEdit) {
      const fullData = {
        id: transactionToEdit.id,
        ...formattedData
      };

      mutateUpdateTransactions(fullData, {
        onSuccess: () => {
          onClose()
          reset()
        },
        onError: (error) => {
          console.log("Erro ao atualizar transação no ExpenseModal: ", error)
        }
      });
    } else {
      const fullData = {
        ...formattedData
      };

      mutateTransactions(fullData, {
        onSuccess: () => {
          onClose();
          reset();
        },
        onError: (error) => {
          console.log("Erro ao salvar: ", error);
        },
      });
    }
  };

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
        <Box
          component="form"
          onSubmit={handleSubmit(handleOnSubmit)}
          className="w-80 sm:w-130 h-150 text-center"
          sx={{ bgcolor: "background01.main"}}
        >
          <Box className="flex justify-end ml-5 mt-2">
            <Button onClick={onClose}>
              <CloseIcon />
            </Button>
          </Box>
          <Box className="flex flex-col items-start sm:grid sm:grid-rows-2 sm:grid-cols-6 mx-10 gap-10">
            <Typography variant="h5" className="sm:col-span-6">
              {transactionToEdit ? t("editExpense") : t("addExpense")}
            </Typography>
            <FormControl className="sm:col-span-3">
              <InputLabel htmlFor="name"><Typography color="typography01">{t("name")}</Typography></InputLabel>
              <Input
                required
                {...register("name")}
                autoComplete="off"
                id="name"
              />
              {errors.name && (
                <Typography variant="caption" color="error">
                  {errors.name.message}
                </Typography>
              )}
            </FormControl>
            <FormControl className="sm:col-span-2">
              <InputLabel htmlFor="amount"><Typography color="typography01">{t("amount")}</Typography></InputLabel>
              <Input required {...register("amount")} id="amount" />
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
                        name="category_id_select_expense"
                        control={control}
                        render={({ field }) => (
                        <Select {...field} 
                          className="min-w-full" 
                          label="Categoria" 
                          required
                          value={field.value || ""}
                          >
                            {queryCategory?.map(
                            (datas) =>
                                datas.type === "expense" && (
                                <MenuItem key={datas.id} value={datas.id}>
                                    {datas.category}
                                </MenuItem>
                                ),
                            )}
                        </Select>
                        )}
                    />
                    <Button onClick={handleCategoryInputTagsOpen} className="h-10!">
                        <AddCircleOutlineIcon sx={{color: "typography01.main"}}/>
                    </Button>
                </Box>
            </FormControl>
            <FormControl className="sm:col-span-2" variant="filled">
                <Box className="flex items-center sm:mr-3!">
                    <InputLabel><Typography color="typography01">{t("method")}</Typography></InputLabel>
                    <Controller
                        name="method_id_select_expense"
                        control={control}
                        render={({ field }) => (
                        <Select 
                        {...field} 
                        className="min-w-full" 
                        label="Método" 
                        required
                        value={field.value || ""}
                        >
                            {queryMethod?.map(
                            (datas) =>
                                datas.type === "expense" && (
                                <MenuItem key={datas.id} value={datas.id}>
                                    {datas.method}
                                </MenuItem>
                                ),
                            )}
                        </Select>
                        )}
                    />
                    <Button onClick={handleMethodInputTagsOpen} className="h-10!">
                        <AddCircleOutlineIcon sx={{color: "typography01.main"}}/>
                    </Button>
                </Box>
            </FormControl>
            <FormControl className="sm:col-span-2">
              <Input required {...register("date")} id="date" type="date" sx={{color: "typography01.main"}}/>
            </FormControl>
            <Button
              className="self-center sm:col-end-4 sm:row-end-9 w-25! h-10!"
              type="submit"
              variant="contained"
            >
              {t("submit")}
            </Button>
          </Box>
          <Controller
            name="category_id_tags_expense"
            control={control}
            render={({ field }) => {
              const safeValue = Array.isArray(queryCategory) ? queryCategory : [];
              
              const currentItem = safeValue.filter((item) => {
                return item.type === "expense";
              });
              const tagValues = currentItem.map((item) => item.category);
              return (
                <InputTags
                  open={inputCategoryTagsOpen}
                  onClose={() => setInputCategoryTagsOpen(false)}
                  value={tagValues}
                  onChange={(newNames) => {
                    if (newNames.length < tagValues.length) {
                      const removedName = tagValues.find(
                        (name) => !newNames.includes(name),
                      );
                      const itemToRemove = currentItem.find(
                        (item) => item.category === removedName,
                      );

                      if (removedName) {
                        mutateDeleteCategory(itemToRemove?.id);
                      }
                    } else {
                      const addedName = newNames[newNames.length - 1];
                      const newObj = {
                        user_id: userId as string,
                        category: addedName,
                        type: "expense",
                      };

                      handleSubmitCategory(newObj);
                    }
                  }}
                />
              );
            }}
          />
          <Controller
            name="method_id_tags_expense"
            control={control}
            render={({ field }) => {
              const safeValue = Array.isArray(queryMethod) ? queryMethod : [];
              const currentItem = safeValue.filter((item) => {
                return item.type === "expense";
              });
              const tagValues = currentItem.map((item) => item.method);
              return (
                <InputTags
                  open={inputMethodTagsOpen}
                  onClose={() => setInputMethodTagsOpen(false)}
                  value={tagValues}
                  onChange={(newNames) => {
                    if (newNames.length < tagValues.length) {
                      const removedName = tagValues.find(
                        (name) => !newNames.includes(name),
                      );
                      const itemToRemove = currentItem.find(
                        (item) => item.method === removedName,
                      );

                      if (removedName) {
                        mutateDeleteMethod(itemToRemove?.id);
                      }
                    } else {
                      const addedName = newNames[newNames.length - 1];
                      const newObj = {
                        user_id: userId as string,
                        method: addedName,
                        type: "expense",
                      };

                      handleSubmitMethod(newObj);
                    }
                  }}
                />
              );
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};
