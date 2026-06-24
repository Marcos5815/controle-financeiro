"use client"

import { useSelectLanguage } from "@/api/language";
import { useProfile } from "@/api/profile";
import { LanguageContextType, useLanguage } from "@/contexts/languageContext";
import { useUser } from "@clerk/nextjs";
import { Button, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { useState } from "react";
import { Controller, ControllerRenderProps, useForm, FieldValues } from "react-hook-form"

export const SelectLanguage = () => {
    const [openLanguage, setOpenLanguage] = useState(false)
    const { control } = useForm()
    const { data } = useSelectLanguage()
    const { t, changeLanguage } = useLanguage()
    const { mutateUpdateUser } = useProfile()
    const { user } = useUser()

    const handleLanguageChange = async (event: SelectChangeEvent<string>, field: ControllerRenderProps<FieldValues, string>) => {
        
        const selectedLanguageCode = event.target.value
        
        field.onChange(selectedLanguageCode)

        const selectedLanguage = data?.find(lang => lang.code === selectedLanguageCode)
        mutateUpdateUser({language_id: selectedLanguage?.id})


        if(selectedLanguage && selectedLanguage.code) {
            changeLanguage(selectedLanguage.code as LanguageContextType)
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
                    defaultValue={user?.unsafeMetadata?.language || ""}
                    render={({field}) => (
                        <Select
                            {...field}
                            open={openLanguage}
                            onClose={() => handleClose(false)}
                            onOpen={() => handleOpen(true)}
                            onChange = {(event) => handleLanguageChange(event, field)}
                            MenuProps={{
                                disablePortal: true,
                            }}
                            label="Language"
                            className="w-40"
                        >
                            {
                                data?.map((datas) => {
                                    return(
                                        <MenuItem key={datas.id} value={datas.code}>{datas.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    )}
                />
            </FormControl>
    )
}