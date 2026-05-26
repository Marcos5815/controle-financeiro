"use client"

import { useLanguage } from "@/contexts/languageContext/page"
import { Box, Button, Typography } from "@mui/material"
import { useState } from "react"
import { LastTransactions } from "../LastTransactions/page"
import { ExpenseByCategory } from "../ExpensesByCategory/page"



export const TransactionChartButton = () =>{

    const [ transactionsSelected, setTransactionSelected ] = useState<boolean>(true);
    const [ chartSelected, setChartSelected ] = useState<boolean>(false);
    const [ activeTab, setActiveTab ] = useState<"transactions" | "chart">("transactions")

    const handleTransactionsOnClick = () => {
        setActiveTab("transactions")
        setTransactionSelected(true)
        setChartSelected(false)
    }

    const handleChartOnClick = () => {
        setActiveTab("chart")
        setChartSelected(true)
        setTransactionSelected(false)
    }

    const {t} = useLanguage()

    return(
        <Box className="flex flex-col gap-3">
            <Box className="flex justify-center items-center gap-5 mt-3 xl:hidden">
                <Button onClick={handleTransactionsOnClick}  variant={transactionsSelected ? "contained" : "outlined"}>
                    <Typography className="text-[14px]! w-25 md:w-45 md:h-8 md:text-[16px]! md:pt-1" color="typography01">
                        {t("transactions")}
                    </Typography>
                </Button>
                <Button onClick={handleChartOnClick} variant={chartSelected ? "contained" : "outlined"}>
                    <Typography className="text-[14px]! w-25 md:w-45 md:h-8 md:text-[16px]! md:pt-1" color="typography01">
                        {t("chart")}
                    </Typography>
                </Button>
            </Box>
            <Box>
                {activeTab === "transactions" ? <LastTransactions className="xl:hidden!" /> : <LastTransactions className="hidden!"/>}
                {activeTab === "chart" ? <ExpenseByCategory className="xl:hidden!" /> : <ExpenseByCategory className="hidden!"/>}
            </Box>
        </Box>
    )
}