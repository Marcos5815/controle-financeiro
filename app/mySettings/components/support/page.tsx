"use client"

import { Box, Button, Typography } from "@mui/material"
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Link from "next/link";
import { useLanguage } from "@/contexts/languageContext/page";

export const Support = () => {

    const { t } = useLanguage()

    return(
        <Box className="flex flex-col justify-center items-center gap-15 min-w-400 min-h-200">
            <Typography variant="h5">
                {t("supportInFirst")} <WhatsAppIcon />
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
    )
}

export default Support;