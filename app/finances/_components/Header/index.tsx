"use client"
import { Box, Typography } from "@mui/material";
import { FilterModal } from "../modals/FilterModal";
import { useLanguage } from "@/contexts/languageContext";
import { Filters } from "../Filters";
import { UserBtn } from "@/components/UserBtn";



export const Header = () => {

  const { t } = useLanguage();

  return (
    <Box className="w-dvw xl:w-[80%]">
      <Box className="w-full flex justify-center items-center md:flex-col xl:flex-row">
        <Box className="w-100 flex gap-3 justify-center items-center">
          <UserBtn />
          <Typography className="text-2xl!">{t("financialControl")}</Typography>
        </Box>
        <FilterModal />
        <Filters className="hidden md:flex" setIsOpen={() => null}/>
      </Box>

    </Box>
  );
};
