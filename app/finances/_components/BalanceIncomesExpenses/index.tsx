"use client"
import { useTransactions } from "@/api/transactions"
import { useLanguage } from "@/contexts/languageContext"
import { useAuth } from "@clerk/nextjs"
import { Box, Paper, Typography } from "@mui/material"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"


export const BalanceIncomesExpenses = () => {

    const { userId } = useAuth()

    const searchParams = useSearchParams();
    const filterPeriod = searchParams.get('period');
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const { data, isLoading, error } = useTransactions(userId);
    const {t} = useLanguage()

    const formattedNumber = new Intl.NumberFormat(
        "pt-BR", {
            style: "currency",
            currency: "BRL"
        }
    );

    const balance = useMemo(() => {
        if(!data) return 0;

        if(filterPeriod === "last-12-months") {
            const today = new Date();
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setFullYear(today.getFullYear() - 1);

            return data
                .filter((transaction) => {
                    const transactionDate = new Date(transaction.date)
                    return transactionDate <= today && transactionDate >= twelveMonthsAgo
                })
                .reduce((acc, current) => {
                    return current.type === "income" ? acc + current.amount : acc - current.amount;
                }, 0)
        }

        if(startDate && endDate) {
            return data
                .filter((transaction) => {
                    return transaction.date >= startDate && transaction.date <= endDate;
                })
                .reduce((acc, current) => {
                    return current.type === "income" ? acc + current.amount : acc - current.amount;
                }, 0)
        }

        return data
        .filter((transaction) => {
            if(!filterPeriod) return data;
            return transaction.date.startsWith(filterPeriod)
        })
        .reduce((acc, current) => {
            return current.type === "income" ? acc + current.amount : acc - current.amount
        }, 0)
    }, [data, filterPeriod, startDate, endDate])

    

    const income = useMemo(() => {
        if(!data) return 0;

        if(filterPeriod === "last-12-months"){
            const today = new Date();
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setFullYear(today.getFullYear() - 1);

            return data
                .filter((transaction) => {
                    const transactionDate = new Date(transaction.date)
                    return transactionDate >= twelveMonthsAgo && transactionDate <= today;
                })
                .reduce((acc, current) => {
                    return current.type === "income" ? acc + current.amount : acc;
                }, 0)
        }

        if(startDate && endDate) {
            return data
                .filter((transaction) => {
                    return transaction.date >= startDate && transaction.date <= endDate;
                })
                .reduce((acc, current) => {
                    return current.type === "income" ? acc + current.amount : acc
                }, 0)
        }

        return data
        .filter((transaction) => {
            if(!filterPeriod) return data;
            return transaction.date.startsWith(filterPeriod);
        }).reduce((acc, current) => {
            return current.type === "income" ? acc + current.amount : acc
        }, 0)
    }, [data, filterPeriod, startDate, endDate])


    const expense = useMemo(() => {
        if(!data) return 0;

        if(filterPeriod === "last-12-months"){
            const today = new Date();
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setFullYear(today.getFullYear() - 1);

            return data
                .filter((transaction) => {
                    const transactionDate = new Date(transaction.date)
                    return transactionDate >= twelveMonthsAgo && transactionDate <= today;
                })
                .reduce((acc, current) => {
                    return current.type === "expense" ? acc + current.amount : acc;
                }, 0)
        }

        if(startDate && endDate) {
            return data
                .filter((transaction) => {
                    return transaction.date >= startDate && transaction.date <= endDate;
                })
                .reduce((acc, current) => {
                    return current.type === "expense" ? acc + current.amount : acc;
                }, 0)
        }

        return data
        .filter((transaction) => {
            if(!filterPeriod) return data;
            return transaction.date.startsWith(filterPeriod)
        })
        .reduce((acc, current) => {
            return current.type === "expense" ? acc + current.amount : acc

        }, 0)
    }, [data, filterPeriod, startDate, endDate])

    return (
        <Box className="w-full overflow-x-auto flex justify-between lg:justify-center 2xl:justify-around gap-3 xl:gap-25 mt-8 no-scrollbar lg:mt-10">
            <Box component={Paper} className="w-full lg:w-60! pr-2">
                <Typography className="text-[16px]! md:text-[20px]! lg:text-[24px]! flex justify-start pt-5 pl-4">
                    {t("balance")}
                </Typography>
                <Typography className="text-[23px]! md:text-[28px]! lg:text-[30px]! flex justify-start text-nowrap pt-5 pl-4 text-3xl! font-bold">
                    {!error && isLoading ? "..." : formattedNumber.format(balance)}
                </Typography>
            </Box>
            <Box component={Paper} className="w-full lg:w-60! pr-2">
                <Typography className="text-[16px]! md:text-[20px]! lg:text-[24px]! flex justify-start  pt-5 pl-4">
                    {t("entrance")}
                </Typography>
                <Typography className="text-[23px]! md:text-[28px]! lg:text-[30px]! flex justify-start text-nowrap pt-5 pl-4 text-3xl! font-bold">
                    {!error && isLoading ? "..." : formattedNumber.format(income)}
                </Typography>
            </Box>
            <Box component={Paper} className="w-full lg:w-60! pr-2">
                <Typography className="text-[16px]! md:text-[20px]! lg:text-[24px]! flex justify-start pt-5 pl-4">
                    {t("expense")}
                </Typography>
                <Typography className="text-[23px]! md:text-[28px]! lg:text-[30px]! flex justify-start text-nowrap pt-5 pl-4 text-3xl! font-bold">
                    {!error && isLoading ? "..." : formattedNumber.format(expense)}
                </Typography>
            </Box>
        </Box>
    )
}