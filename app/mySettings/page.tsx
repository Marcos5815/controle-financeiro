"use client"

import { useLanguage } from "@/contexts/languageContext";
import { ThemeContext } from "@/contexts/themeContext";
import { useUser } from "@clerk/nextjs";
import { Box, Button, FormControlLabel, Modal, Paper, Switch, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useContext } from "react";
import LanguageSelect from "./_components/languageSelect/page";
import CloseIcon from '@mui/icons-material/Close';

interface propsTypes {
    open: boolean,
    onClose: () => void
}

const MySettings = ({ open, onClose}: propsTypes) => {
    const { user } = useUser()
    const { toggleTheme } = useContext(ThemeContext)
    const { t } = useLanguage()
    if(!user) return null
    const isDarkMode = Cookies.get("theme") === "dark"
    
    


    return(
        <Box>
            <Modal
                open={open}
                onClose={onClose}
                className="flex flex-col justify-center items-center"
            >
                <Box className="h-[90%] w-[90%] xl:w-[65%] xl:h-[70%] 2xl:w-[45%] 2xl:h-[75%] rounded-2xl!" sx={{bgcolor: "background01.main"}} > 
                    <Box className="flex justify-between bg-gray-100 rounded-t-2xl" sx={{bgcolor: "background01.main"}}>
                        <Typography className="font-bold! text-xl! ml-3! mt-0.5!" sx={{color: "typography01.main"}}>{t("settings")}</Typography>
                        <Button onClick={onClose}><CloseIcon sx={{color: "settingsCloseIcon.main"}}/></Button>
                    </Box>
                    <Box className="h-full w-full flex flex-col justify-center items-center rounded-t-xl border-t border-gray-200">
                        <LanguageSelect />
                        <FormControlLabel
                            control={<Switch color="success" onChange={toggleTheme} checked={isDarkMode}/>}
                            label={t("darkMode")}
                            labelPlacement="start"
                            slotProps={{
                                typography: { variant: "h6", sx: { textTransform: "uppercase" } } 
                            }}
                        />
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default MySettings;