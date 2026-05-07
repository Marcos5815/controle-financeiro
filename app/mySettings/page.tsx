"use client"

import { useLanguage } from "@/contexts/languageContext/page";
import { ThemeContext } from "@/contexts/themeContext/page";
import { Box, Button, FormControlLabel, Switch, Typography } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";

const MySettings = () => {

    const { toggleTheme } = useContext(ThemeContext)
    const { t } = useLanguage()

    return(
        <Box className="flex flex-col justify-center items-center gap-15 min-w-400 min-h-200" > 
            <FormControlLabel
                control={<Switch color="success" onChange={toggleTheme}/>}
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