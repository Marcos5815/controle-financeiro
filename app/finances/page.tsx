"use client"
import { Box, Button, Paper, Typography } from "@mui/material"
import { Header } from "./components/Header/page"
import { BalanceIncomesExpenses } from "./components/BalanceIncomesExpenses/page"
import { AddTransactions } from "./components/AddTransactions/page"
import { ExpenseByCategory } from "./components/ExpensesByCategory/page"
import { LastTransactions } from "./components/LastTransactions/page"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState } from "react"
import { IncomeModal } from "./components/modals/IncomeModal/page"
import { ExpenseModal } from "./components/modals/ExpenseModal/page"
import { green } from "@mui/material/colors"
import { useLanguage } from "@/contexts/languageContext/page"

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
        <Box>
            <Header />
            <BalanceIncomesExpenses />
            <Box className="flex justify-around mt-10">
                <ExpenseByCategory component={Paper} className="w-114" />
                <Box className="flex flex-col gap-10">
                        <Box className = "flex gap-10">
                            <Box component={Paper} className="w-100 h-20">
                            <Button onClick={handleIsIncomeOpen} className="flex w-100 h-20 justify-start! gap-3 pl-5!">
                            <Box className="flex rounded-md w-10 h-10 justify-center items-center bg-green-100">
                                <AddCircleOutlineIcon className="text-green-600" />
                            </Box>
                            <Box className="flex flex-col items-start">
                                <Typography className="text-green-600">{t("addEntrance")}</Typography>
                                <Typography className="text-[8px]! text-green-600">
                                    {t("addEntranceLabel")}
                                </Typography>
                            </Box>
                            </Button>
                        </Box>
                        <Box component={Paper} className="w-100 h-20">
                            <Button onClick={handleIsExpenseOpen} className="flex w-100 h-20 justify-start! gap-3 pl-5!">
                                <Box className="flex rounded-md w-10 h-10 justify-center items-center bg-red-100">
                                    <RemoveCircleOutlineIcon className="text-red-500" />
                                </Box>
                                <Box className="flex flex-col items-start">
                                    <Typography className="text-red-500">{t("addExpense")}</Typography>
                                    <Typography className="text-[8px]! text-red-500">
                                        {t("addExpenseLabel")}
                                    </Typography>
                                </Box>
                            </Button>
                        </Box>
                    </Box>
                    <LastTransactions component={Paper} className="" />
                </Box>
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