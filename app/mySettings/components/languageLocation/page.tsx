"use client"

import { SelectLanguage } from "./components/SelectLanguage/page";
import { Box } from "@mui/material";

export const LanguageLocation = () => {
       

    return(
        <Box className="w-full h-full flex flex-col justify-center items-center gap-5">
            <SelectLanguage />
        </Box>
    )
}

export default LanguageLocation;