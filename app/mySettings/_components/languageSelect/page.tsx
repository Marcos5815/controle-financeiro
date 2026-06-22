"use client"

import { SelectLanguage } from "./components/SelectLanguage/page";
import { Box } from "@mui/material";

export const LanguageSelect = () => {
       

    return(
        <Box className="flex flex-col justify-center items-center gap-5 mb-5">
            <SelectLanguage />
        </Box>
    )
}

export default LanguageSelect;