"use client"

import { useLanguageLocation } from "@/api/languageLocation/page";
import { useLanguage } from "@/contexts/languageContext/page";
import { Box, Button, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import Link from "next/link";
import { useState } from "react";

export const Language = () => {
    const [openLanguage, setOpenLanguage] = useState(false);
    const [openLocation, setOpenLocation] = useState(false);
    const { data } = useLanguageLocation();
    const storage = localStorage;
    const { t, setLanguage } = useLanguage()

    const handleLanguageChange = (event: SelectChangeEvent<string>) => {
       
        storage.setItem("language", event.target.value)
        if(storage.getItem("language") === "Português") {
            setLanguage("pt-BR")
        } else if (storage.getItem("language") === "English") {
            setLanguage("en-US")
        }
        
    }

    const handleLocationChange = (event: SelectChangeEvent<string>) => {
        storage.setItem("location", event.target.value)
    }

    const handleClose = (language: boolean, location: boolean) => {
        setOpenLanguage(language);
        setOpenLocation(location);
    }

    const handleOpen = (language: boolean, location: boolean) => {
        setOpenLanguage(language);
        setOpenLocation(location);
    }

    return(
        <Box className="w-full h-screen flex flex-col justify-center items-center">
            <Box className="flex justify-center items-center gap-15">
                <Button onClick={() => handleOpen(true, false)}>
                    <Typography color="typography01">{t("languages")}</Typography>
                </Button>
                <Select
                    open={openLanguage}
                    onClose={() => handleClose(false, false)}
                    onOpen={() => handleOpen(true, false)}
                    value={localStorage.getItem("language") || ""}
                    label="Language"
                    onChange={handleLanguageChange}
                    className="w-40"
                >
                    {
                        data?.map((datas) => {
                            return(
                                datas.isLanguage === true ? <MenuItem key={datas.id} value={datas.language}>{datas.language}</MenuItem> : undefined
                            )
                        })
                    }
                </Select>
            </Box>
            <Box>
                <Button onClick={() => handleOpen(false, true)}>
                    <Typography color="typography01">
                        {t("country")}
                    </Typography>
                </Button>
                <Select
                    open={openLocation}
                    onClose={() => handleClose(false, false)}
                    onOpen={() => handleOpen(false, true)}
                    value={localStorage.getItem("location") || ""}
                    label="location"
                    onChange={handleLocationChange}
                    className="w-40 ml-17.5 mt-5 mb-5"
                >
                    {
                        data?.map((datas) => (
                            datas.isLanguage === false ? <MenuItem key={datas.id} value={datas.location}>{datas.location}</MenuItem> : undefined
                        ))
                    }
                </Select>
            </Box>
            <Link href={"/mySettings"}>
                <Button variant="outlined" sx={{ bgcolor: "sideBarButton.main"}}>
                    <Typography color="typography01">
                        {t("return")}
                    </Typography>
                </Button>
            </Link>
        </Box>
    )
}

export default Language;