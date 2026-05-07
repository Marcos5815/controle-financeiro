"use client";

import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTypes, useFinance } from "@/api/finances/page";
import { addTransactionSchema } from "../Schema/page";
import {
  DataTypesMethodCategory,
  useMethodCategory,
} from "@/api/methodCategory/page";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { InputTags } from "../../InputTags/page";
import { uuidv4 } from "zod";
import { useLanguage } from "@/contexts/languageContext/page";

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  transactionToEdit: DataTypes | null;
}

export const ExpenseModal = ({
  open,
  onClose,
  transactionToEdit,
}: ExpenseModalProps) => {
  const {
    data: allMethodCategories,
    mutateMethodCategory,
    deleteMethodCategory,
  } = useMethodCategory();
  const { mutate, updateMutation } = useFinance();
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
      category: "",
      method: "",
      methodCategory: [],
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
          methodCategory: allMethodCategories || [],
        });
      } else {
        reset({
          name: "",
          amount: "",
          category: "",
          method: "",
          date: "",
          methodCategory: allMethodCategories || [],
        });
      }
    }
  }, [transactionToEdit, reset, open, allMethodCategories]);

  const handleOnSubmit = (formData: addTransactionSchema) => {
    if (transactionToEdit) {
      const fullData = {
        ...transactionToEdit,
        ...formData,
        type: "EXPENSE",
      };

      updateMutation.mutate(
        { formData: fullData, id: transactionToEdit.id },
        {
          onSuccess: () => {
            onClose();
            reset();
          },
        },
      );
    } else {
      const fullData = {
        ...formData,
        type: "EXPENSE",
      };

      mutate(fullData, {
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

  const handleSubmitMethodCategory = (formData: DataTypesMethodCategory) => {
    mutateMethodCategory(formData, {
      onSuccess: () => {
        reset();
      },

      onError: (error) => {
        console.log("Erro ao salvar a categoria ou método", error);
      },
    });
  };

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
          className="w-130 h-150 text-center"
          sx={{ bgcolor: "background01.main"}}
        >
          <Box className="flex justify-end ml-5 mt-2">
            <Button onClick={onClose}>
              <CloseIcon />
            </Button>
          </Box>
          <Box className="grid grid-rows-2 grid-cols-6 mx-10 gap-10">
            <Typography variant="h5" className="col-span-6">
              {transactionToEdit ? t("editExpense") : t("addExpense")}
            </Typography>
            <FormControl className="col-span-3">
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
            <FormControl className="col-span-2">
              <InputLabel htmlFor="amount"><Typography color="typography01">{t("amount")}</Typography></InputLabel>
              <Input required {...register("amount")} id="amount" />
              {errors.amount && (
                <Typography variant="caption" color="error">
                  {errors.amount.message}
                </Typography>
              )}
            </FormControl>

            <FormControl variant="filled" className="col-span-3">
                <Box className="flex items-center mr-3!">
                    <InputLabel><Typography color="typography01">{t("category")}</Typography></InputLabel>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                        <Select {...field} className="min-w-full" label="Categoria" required>
                            {allMethodCategories?.map(
                            (datas) =>
                                datas.type === "EXPENSE" &&
                                datas.isCategory === true && (
                                <MenuItem key={datas.id} value={datas.category}>
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
            <FormControl className="col-span-2" variant="filled">
                <Box className="flex items-center mr-3!">
                    <InputLabel><Typography color="typography01">{t("method")}</Typography></InputLabel>
                    <Controller
                        name="method"
                        control={control}
                        render={({ field }) => (
                        <Select {...field} className="min-w-full" label="Método" required>
                            {allMethodCategories?.map(
                            (datas) =>
                                datas.type === "EXPENSE" &&
                                datas.isCategory === false && (
                                <MenuItem key={datas.id} value={datas.method}>
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
            <FormControl className="col-span-2">
              <Input required {...register("date")} id="date" type="date" sx={{color: "typography01.main"}}/>
            </FormControl>
            <Button
              className="col-end-4 row-end-9 w-25! h-10!"
              type="submit"
              variant="contained"
            >
              {t("submit")}
            </Button>
          </Box>
          <Controller
            name="methodCategory"
            control={control}
            render={({ field }) => {
              const safeValue = Array.isArray(field.value) ? field.value : [];
              console.log(field);
              const currentItem = safeValue.filter((item) => {
                return item.type === "EXPENSE" && item.isCategory === true;
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
                        deleteMethodCategory(itemToRemove.id);
                      }
                    } else {
                      const addedName = newNames[newNames.length - 1];
                      const newObj = {
                        id: uuidv4(),
                        category: addedName,
                        isCategory: true,
                        type: "INCOME",
                      };

                      handleSubmitMethodCategory(newObj);
                    }
                  }}
                />
              );
            }}
          />
          <Controller
            name="methodCategory"
            control={control}
            render={({ field }) => {
              const safeValue = Array.isArray(field.value) ? field.value : [];
              const currentItem = safeValue.filter((item) => {
                return item.type === "EXPENSE" && item.isCategory === false;
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
                        (item) => item.category === removedName,
                      );

                      if (removedName) {
                        deleteMethodCategory(itemToRemove.id);
                      }
                    } else {
                      const addedName = newNames[newNames.length - 1];
                      const newObj = {
                        id: uuidv4(),
                        category: addedName,
                        isCategory: true,
                        type: "INCOME",
                      };

                      handleSubmitMethodCategory(newObj);
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
