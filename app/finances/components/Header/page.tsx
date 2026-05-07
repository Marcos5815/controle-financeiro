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
import { useLanguage } from "@/contexts/languageContext/page";



export const Header = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const lastMonth = new Date(year, month - 1).toISOString().slice(0, 7)
  const thisYear = new Date().toISOString().slice(0, 4)
  const [value, setValue] = useState<DateRange<Dayjs>>([null, null])
  const {t} = useLanguage()

  const filterDate = (period: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', period);
    params.delete('start')
    params.delete('end')
    router.push(`?${params.toString()}`)
    setValue([null, null])
  }

  const handleRangeDate = () => {
    if(value[0] && value[1]) {
      const start = value[0].format('YYYY-MM-DD');
      const end = value[1].format('YYYY-MM-DD');

      const params = new URLSearchParams(searchParams.toString());
      params.set('start', start);
      params.set('end', end);
      params.delete('period');
      router.push(`?${params.toString()}`);

    }
  }

  useEffect(() => {
    if(!searchParams.get('period') && !searchParams.get('start') && !searchParams.get('end')) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('period', thisYear);
        router.replace(`?${params.toString()}`)
    }
  }, [searchParams, router, thisYear])

  return (
    <Box className="flex w-400 ml-7 justify-between items-center">
      <Typography variant="h4">{t("financialControl")}</Typography>
      <Box className="flex gap-3">
        <Button
          component={Paper}
          className="w-33! h-12!" 
          onClick={() => filterDate(currentMonth)} 
          variant={searchParams.get('period') === currentMonth ? "contained" : "outlined"}
          >
            <Typography color="typography01">{t("currentMonth")}</Typography>
        </Button>

        <Button
          component={Paper}
          className="w-33! h-12!" 
          onClick={() => filterDate(lastMonth)} 
          variant={searchParams.get('period') === lastMonth ? "contained" : "outlined"}
         >
          <Typography color="typography01">{t("lastMonth")}</Typography>
         </Button>

        <Button
          component={Paper}
          className="w-33! h-12!" 
          onClick={() => filterDate(thisYear)}
          variant={searchParams.get('period') === thisYear ? "contained" : "outlined"}
        >
          <Typography color="typography01">{t("currentYear")}</Typography>
        </Button>

        <Button 
          component={Paper}
          className="w-33! h-12!" 
          onClick={() => filterDate("last-12-months")}
          variant={searchParams.get('period') === "last-12-months" ? "contained" : "outlined"}
        >
          <Typography color="typography01">{t("last12Months")}</Typography>
        </Button>
        
        <Box component={Paper} className="w-65 h-12 border rounded-md p-1">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateRangePicker 
                    calendars={1} 
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    format="DD/MM/YYYY"
                    slotProps={{ textField: {size: 'small'} }}
                  />
          </LocalizationProvider>
        </Box>
          <Button 
            component={Paper}
            onClick={handleRangeDate}
            variant="outlined"
          >
            <Typography color="typography01">{t("filter")}</Typography>
          </Button>
      </Box>
    </Box>
  );
};
