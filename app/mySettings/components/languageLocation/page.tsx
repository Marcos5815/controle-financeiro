"use client"

import { useLanguage } from "@/contexts/languageContext/page";
import { Box, Button, Typography } from "@mui/material"
import Link from "next/link";
import { SelectLocation } from "./components/SelectLocation/page";
import { SelectLanguage } from "./components/SelectLanguage/page";

export const LanguageLocation = () => {
    
    const { t } = useLanguage()
    

    return(
        <Box className="w-full h-screen flex flex-col justify-center items-center gap-5">
            <SelectLanguage />
            <SelectLocation />
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

export default LanguageLocation;