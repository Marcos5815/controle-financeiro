"use client"

import { useLanguage } from "@/contexts/languageContext/page";
import { ThemeContext } from "@/contexts/themeContext/page";
import { useUser } from "@clerk/nextjs";
import { Box, Button, FormControlLabel, Switch, Typography } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";


const MySettings = () => {
    const { user } = useUser()
    const { toggleTheme } = useContext(ThemeContext)
    const { t } = useLanguage()
    if(!user) return null
    const isDarkMode = user.unsafeMetadata.theme === "dark"
    
    
    


    return(
        <Box className="h-full w-full flex flex-col justify-center items-center mt-10" > 
            <FormControlLabel
                control={<Switch color="success" onChange={toggleTheme} checked={isDarkMode}/>}
                label={t("darkMode")}
                labelPlacement="start"
                slotProps={{
                    typography: { variant: "h6", sx: { textTransform: "uppercase" } } 
                }}
            />
            <Link href={"/mySettings/components/languageLocation"}>
                <Button>
                    <Typography variant="h6" color="typography01">{t("languageAndRegion")}</Typography>
                </Button>
            </Link>
        </Box>
    )
}

export default MySettings;