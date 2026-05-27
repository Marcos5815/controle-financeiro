"use client"

import { Box, Button, Typography } from "@mui/material"
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Link from "next/link";
import { useLanguage } from "@/contexts/languageContext/page";

export const Support = () => {

    const { t } = useLanguage()

    return(
        <Box className="w-full h-screen flex justify-center items-center!">
            <Box className="w-[80%] flex flex-col items-center gap-15">
                <Typography variant="h5">
                    {t("supportInFirst")} <WhatsAppIcon color="success" />
                </Typography>
                <Typography variant="h5">
                    {t("supportInSecond")}
                </Typography>
                <Link href={"/mySettings"}>
                    <Button variant="outlined" sx={{ bgcolor: "sideBarButton.main"}}>
                        <Typography color="sideBarUser">{t("return")}</Typography>
                    </Button>
                </Link>
            </Box>
        </Box>
    )
}

export default Support;