"use client"
import { Box, Button, Paper, Typography } from "@mui/material"
import { Header } from "./components/Header/page"
import { BalanceIncomesExpenses } from "./components/BalanceIncomesExpenses/page"
import { ExpenseByCategory } from "./components/ExpensesByCategory/page"
import { LastTransactions } from "./components/LastTransactions/page"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState } from "react"
import { IncomeModal } from "./components/modals/IncomeModal/page"
import { ExpenseModal } from "./components/modals/ExpenseModal/page"
import { useLanguage } from "@/contexts/languageContext/page"
import { TransactionChartButton } from "./components/TransactionsChartButton/page"

const Finances = () => {

    const [ isIncomeModalOpen, setIsIncomeModalOpen ] = useState(false)
    const [ isExpenseModalOpen, setIsExpenseModalOpen ] = useState(false)
    const {t} = useLanguage()

    const handleIsIncomeOpen = () => {
        setIsIncomeModalOpen((prevOpen) => !prevOpen)
    }

    const handleIsExpenseOpen = () => {
        setIsExpenseModalOpen((prevOpen) => !prevOpen)
    }


    return (
        <Box className="pt-5 xl:flex xl:flex-col xl:justify-between xl:items-center">
            <Header />
            <BalanceIncomesExpenses />
            <Box className="flex justify-around flex-col mt-3 xl:mt-10 xl:gap-10 2xl:gap-15">
                <Box className = "flex gap-10 justify-center items-center">
                    <Box component={Paper} className="w-20 sm:w-60 md:w-80 sm:h-20">
                        <Button onClick={handleIsIncomeOpen} className="flex w-20 sm:w-60 md:w-80 lg:w-100 sm:h-20 justify-start! gap-3 pl-5!">
                        <Box className="flex rounded-md w-10 h-10 justify-center items-center bg-green-100">
                            <AddCircleOutlineIcon className="text-green-600" />
                        </Box>
                        <Box className="flex flex-col items-start">
                            <Typography className="hidden sm:block text-green-600">{t("addEntrance")}</Typography>
                            <Typography className="hidden md:block text-[8px]! text-green-600">
                                {t("addEntranceLabel")}
                            </Typography>
                        </Box>
                        </Button>
                    </Box>
                    <Box component={Paper} className="w-20 sm:w-60 md:w-80 md:h-20">
                        <Button onClick={handleIsExpenseOpen} className="flex w-20 sm:w-60 md:w-80 lg:w-100 sm:h-20 justify-start! gap-3 pl-5!">
                            <Box className="flex rounded-md w-10 h-10 justify-center items-center bg-red-100">
                                <RemoveCircleOutlineIcon className="text-red-500" />
                            </Box>
                            <Box className="flex flex-col items-start">
                                <Typography className="hidden sm:block text-red-500">{t("addExpense")}</Typography>
                                <Typography className="hidden md:block text-[8px]! text-red-500">
                                    {t("addExpenseLabel")}
                                </Typography>
                            </Box>
                        </Button>
                    </Box>
                </Box>   
                <Box className="flex gap-5 2xl:gap-10">
                    <ExpenseByCategory component={Paper} className="hidden xl:block w-114" />
                    <LastTransactions component={Paper} className="hidden xl:block w-150" />
                </Box>
                <TransactionChartButton />
            </Box>
            <IncomeModal 
                open={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                transactionToEdit={null}

            />
            <ExpenseModal 
                open={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                transactionToEdit={null}
            />
        </Box>
    )
}

export default Finances