"use client"
import { useFinance } from "@/api/finances/page";
import { useLanguage } from "@/contexts/languageContext/page";
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from "@mui/material"
import { PieChart } from '@mui/x-charts/PieChart';
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const ExpenseByCategory = ({ ...props }) => {
    const { data: dt, isLoading, error } = useFinance()
    const { t } = useLanguage()
    const searchParams = useSearchParams()
    const filterPeriod = searchParams.get('period')
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

    interface CategorySum {
        id: string;
        value: number;
        label: string;
    }

    
    const chartData = useMemo(() => {
        if(!dt || error || isLoading) return []


        if(filterPeriod === "last-12-months"){
            const today = new Date();
            const lastTwelveMonths = new Date();
            lastTwelveMonths.setFullYear(today.getFullYear() - 1)

            return dt
                .filter((item) => {
                    const itemDate = new Date(item.date)
                    return itemDate >= lastTwelveMonths && itemDate <= today && item.type === "EXPENSE";
                })
                .reduce((acc, current) => {
                const categoryExists = acc.find(item => item.label === current.category);

                if(categoryExists){
                    categoryExists.value += current.amount;
                } else {
                    acc.push({
                        id: current.id,
                        value: current.amount,
                        label: current.category
                    })
                }
                return acc
            }, [] as CategorySum[]);
        }

        if(startDate && endDate) {
            return dt   
                .filter((item) => {
                    return item.date >= startDate && item.date <= endDate && item.type === "EXPENSE";
                })
                .reduce((acc, current) => {
                const categoryExists = acc.find(item => item.label === current.category);

                if(categoryExists){
                    categoryExists.value += current.amount;
                } else {
                    acc.push({
                        id: current.id,
                        value: current.amount,
                        label: current.category
                    })
                }
                return acc
            }, [] as CategorySum[]);
        }

 
        return dt
            .filter((item) => {
                if(!filterPeriod) return 0
                return item.type === "EXPENSE" && item.date.startsWith(filterPeriod)
            })
            .reduce((acc, current) => {
                const categoryExists = acc.find(item => item.label === current.category);

                if(categoryExists){
                    categoryExists.value += current.amount;
                } else {
                    acc.push({
                        id: current.id,
                        value: current.amount,
                        label: current.category
                    })
                }
                return acc
            }, [] as CategorySum[]);
    }, [dt, error, isLoading, filterPeriod, startDate, endDate])

    const valueFormatter = (item: { value: number}) => `R$ ${item.value.toFixed(2).replace(".", ",")}`

    
    
    if(isLoading) return <CircularProgress />



    return(
        <Box { ...props }>
            <Typography variant="h4" className="mt-5! text-[28px]! font-bold! text-center">{t("expenseByCategory")}</Typography>
            {chartData.length > 0 ? (
                <PieChart 
                    className="mb-15!"
                    series={[
                        {
                            data: chartData,
                            highlightScope: {fade: 'global', highlight: 'item'},
                            faded: {innerRadius: 30, additionalRadius: -30, color: 'gray'},
                            valueFormatter,


                        },
                    ]}
                    width={280}
                    height={300}

                    slotProps={{
                        legend: {
                            direction: isDesktop ? "vertical" : "horizontal",
                            position: {
                                vertical: isDesktop ? "middle" : "bottom",
                                horizontal: isDesktop ? "end" : "center"
                            },
                            
                        }
                    }}

                />
            ) : (
                <Typography>{t("notDataFound")}</Typography>
            )}
        </Box>
    )
}