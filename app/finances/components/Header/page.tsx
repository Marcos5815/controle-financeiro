"use client"
import { Box, Typography } from "@mui/material";
import { FilterModal } from "../modals/FilterModal/page";
import { useLanguage } from "@/contexts/languageContext/page";
import { Filters } from "../Filters/page";



export const Header = () => {

  const { t } = useLanguage();

  return (
    <Box className="w-dvw xl:w-[80%]">
      <Box className="w-full flex justify-center items-center md:flex-col xl:flex-row">
        <Typography className="text-2xl!">{t("financialControl")}</Typography>
        <FilterModal />
        <Filters className="hidden md:flex" setIsOpen={() => null}/>
      </Box>

    </Box>
  );
};
