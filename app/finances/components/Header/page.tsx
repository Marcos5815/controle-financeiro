"use client"
import { Box, Typography } from "@mui/material";
import { FilterModal } from "../modals/FilterModal/page";
import { useLanguage } from "@/contexts/languageContext/page";
import { Filters } from "../Filters/page";
import { UserBtn } from "@/components/UserBtn/page";



export const Header = () => {

  const { t, language } = useLanguage();

  return (
    <Box className="w-dvw xl:w-[80%]">
      <Box className="w-full flex justify-center items-center md:flex-col xl:flex-row">
        <Box className="w-100 flex gap-3 justify-center items-center">
          <UserBtn key={language} />
          <Typography className="text-2xl!">{t("financialControl")}</Typography>
        </Box>
        <FilterModal />
        <Filters className="hidden md:flex" setIsOpen={() => null}/>
      </Box>

    </Box>
  );
};
