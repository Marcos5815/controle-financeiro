"use client"

import { Box, Button, Paper, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useEffect, useState } from "react";
import { DateRange } from "@mui/x-date-pickers-pro/models";
import { Dayjs } from "dayjs";
import { useLanguage } from "@/contexts/languageContext";

interface setIsOpenProp {
  setIsOpen: (value: boolean) => void;
  className?: string;
}

export const Filters = ({setIsOpen, ...props}: setIsOpenProp) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const lastMonth = new Date(year, month - 1).toISOString().slice(0, 7);
  const thisYear = new Date().toISOString().slice(0, 4);
  const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);
  const { t } = useLanguage();


  const filterDate = (period: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    params.delete("start");
    params.delete("end");
    router.push(`?${params.toString()}`);
    setValue([null, null]);

    setIsOpen(false)
  };

  const handleRangeDate = () => {
    if (value[0] && value[1]) {
      const start = value[0].format("YYYY-MM-DD");
      const end = value[1].format("YYYY-MM-DD");

      const params = new URLSearchParams(searchParams.toString());
      params.set("start", start);
      params.set("end", end);
      params.delete("period");
      router.push(`?${params.toString()}`);

    }

    setIsOpen(false)
  };

  useEffect(() => {
    if (
      !searchParams.get("period") &&
      !searchParams.get("start") &&
      !searchParams.get("end")
    ) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("period", thisYear);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router, thisYear]);
    return (
        <Box className={`flex flex-col justify-center gap-2! w-[70%]! p-2! md:flex-row md:flex-wrap ${props.className || ''}`} >
          <Box className="flex flex-col gap-2 md:flex-row md:items-center">
            <Button
              component={Paper}
              className="h-10"
              onClick={() => filterDate(currentMonth)}
              variant={
                searchParams.get("period") === currentMonth
                  ? "contained"
                  : "outlined"
              }
            >
              <Typography color="typography01" className="text-[12px]! sm:text-[15px]!">{t("currentMonth")}</Typography>
            </Button>

            <Button
              component={Paper}
              className="h-12"
              onClick={() => filterDate(lastMonth)}
              variant={
                searchParams.get("period") === lastMonth
                  ? "contained"
                  : "outlined"
              }
            >
              <Typography color="typography01" className="text-[12px]! sm:text-[15px]!">{t("lastMonth")}</Typography>
            </Button>

            <Button
              component={Paper}
              className="h-12"
              onClick={() => filterDate(thisYear)}
              variant={
                searchParams.get("period") === thisYear ? "contained" : "outlined"
              }
            >
              <Typography color="typography01" className="text-[12px]! sm:text-[15px]!">{t("currentYear")}</Typography>
            </Button>

            <Button
              component={Paper}
              className="h-12"
              onClick={() => filterDate("last-12-months")}
              variant={
                searchParams.get("period") === "last-12-months"
                  ? "contained"
                  : "outlined"
              }
            >
              <Typography color="typography01" className="text-[12px]! sm:text-[15px]!">{t("last12Months")}</Typography>
            </Button>
          </Box>

          <Box className="flex justify-around items-center gap-2 mt-2 xl:mt-0 xl:justify-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker
                calendars={1}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                format="DD/MM/YYYY"
                className="h-12"
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
            <Button
                component={Paper}
                className="h-12"
                onClick={handleRangeDate}
                variant="outlined"
                
            >
                <Typography color="typography01" className="text-[12px]! sm:text-[15px]!">{t("filter")}</Typography>
            </Button>
          </Box>
        </Box>
    )
}