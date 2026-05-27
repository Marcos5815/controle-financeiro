"use client"

import { useLanguage } from "@/contexts/languageContext/page";
import { ThemeContext } from "@/contexts/themeContext/page";
import { Box, Button, FormControlLabel, Switch, Typography } from "@mui/material";
import Link from "next/link";
import { useContext, useState } from "react";

const storage = localStorage
const theme = storage.getItem("theme")


const initialCheck = () => {
    let isChecked = false
    if( typeof window !== "undefined") {
        if(theme === "dark") {
            return isChecked = true
        } {
            return isChecked = false
        }
    }
    return isChecked
}

const MySettings = () => {

    

    const [checked, setChecked] = useState<boolean>(initialCheck)
    const { toggleTheme } = useContext(ThemeContext)
    const { t } = useLanguage()

    const handleChange = () => {
        toggleTheme()
        setChecked(!checked)
    }

    return(
        <Box className="h-screen w-full flex flex-col justify-center items-center" > 
            <FormControlLabel
                control={<Switch color="success" onChange={handleChange} checked={checked}/>}
                label={t("darkMode")}
                labelPlacement="start"
                slotProps={{
                    typography: { variant: "h6", sx: { textTransform: "uppercase" } } 
                }}
            />
            <Link href={"/mySettings/components/language"}>
                <Button>
                    <Typography variant="h6" color="typography01">{t("languageAndRegion")}</Typography>
                </Button>
            </Link>
            <Link href="mySettings/components/support">
                <Button>
                    <Typography variant="h6" color="typography01">{t("support")}</Typography>
                </Button>
            </Link>
            <Button>
                <Typography variant="h6" color="typography01">{t("signout")}</Typography>
            </Button>
        </Box>
    )
}

export default MySettings;