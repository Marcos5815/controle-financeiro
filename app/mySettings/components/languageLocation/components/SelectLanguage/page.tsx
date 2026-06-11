"use client"

import { useSelectLanguage } from "@/api/language";
import { useLanguage } from "@/contexts/languageContext/page";
import { Button, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { useState } from "react";
import { Controller, useForm } from "react-hook-form"

export const SelectLanguage = () => {
    const [openLanguage, setOpenLanguage] = useState(false)
    const { control } = useForm()
    const { data, isLoading } = useSelectLanguage()
    const { t, setLanguage } = useLanguage()
    const storage = localStorage;

    const handleLanguageChange = (event: SelectChangeEvent<string>, field) => {
        
        const selectedLanguageId = event.target.value

        
        field.onChange(selectedLanguageId)

        const selectedLanguage = data?.find(lang => lang.id === selectedLanguageId)

        if(selectedLanguageId) {
            storage.setItem("language", selectedLanguageId.toString())
        }

        if(selectedLanguage?.name === "Português") {
            setLanguage("pt-BR")
        } else if (selectedLanguage?.name === "English") {
            setLanguage("en-US")
        }
        
    }


    const handleClose = (language: boolean) => {
        setOpenLanguage(language);
    }

    const handleOpen = (language: boolean) => {
        setOpenLanguage(language);
    }

    return (
        <FormControl className="w-full flex justify-center items-center gap-5">
                <Button onClick={() => handleOpen(true)}>
                    <Typography color="typography01">{t("languages")}</Typography>
                </Button>
                <Controller 
                    name="language"
                    control={control}
                    defaultValue={localStorage.getItem("language") || ""}
                    render={({field}) => (
                        <Select
                            {...field}
                            open={openLanguage}
                            onClose={() => handleClose(false)}
                            onOpen={() => handleOpen(true)}
                            onChange = {(event) => handleLanguageChange(event, field)}
                            label="Language"
                            className="w-40"
                        >
                            {
                                data?.map((datas) => {
                                    return(
                                        <MenuItem key={datas.id} value={datas.id}>{datas.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    )}
                />
            </FormControl>
    )
}