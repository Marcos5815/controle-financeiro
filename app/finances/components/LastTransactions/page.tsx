"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DataTypes, useFinance } from "@/api/finances/page";
import {
  Box,
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useSearchParams } from "next/navigation";
import { IncomeModal } from "../modals/IncomeModal/page";
import { ExpenseModal } from '../modals/ExpenseModal/page';
import { useLanguage } from "@/contexts/languageContext/page";

const formattedValue = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

export const LastTransactions = ({ ...props }) => {
  const searchParams = useSearchParams()
  const { data, isLoading, error, deleteTransaction } = useFinance();

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  
  const periodFilter = searchParams.get('period')
  const startRangeDate = searchParams.get('start')
  const endRangeDate = searchParams.get('end')

  const options = ["Editar", "Apagar"]

  const [ transactionToEdit, setTransactionToEdit] = useState<DataTypes | null>(null)

  const [ open, setOpen] = useState(false);
  const [ selectedIndex, setSelectedIndex ] = useState(0);
  const [ anchorEl, setAnchorEl ] = useState<HTMLElement | null>(null)
  const anchorRef = useRef<HTMLElement>(null)

  const [ selectId, setSelectId ] = useState<string>("")

  const [ isIncomeModalOpen, setIsIncomeModalOpen ] = useState(false)
  const [ isExpenseModalOpen, setIsExpenseModalOpen ] = useState(false)

  const {t} = useLanguage()

  useEffect(() => {
    setAnchorEl(anchorRef.current)
  }, []);

  const handleOnToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  }

  const handleMenuItemclick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    setSelectedIndex(index)
    setOpen(false)
  }

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)){
      return
    }

    setOpen(false);
  }



  const filteredData = useMemo(() => {
    if(!data) return []

    if(periodFilter === "last-12-months") {
      const today = new Date();
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setFullYear(today.getFullYear() - 1);

      return data.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= twelveMonthsAgo && transactionDate <= today
      })
    }

    if(startRangeDate && endRangeDate) {
      return data.filter((transaction) => {
        return transaction.date >= startRangeDate && transaction.date <= endRangeDate;
      })
    }

    return data.filter((transaction) => {
      if(!periodFilter) return data;
      return transaction.date.startsWith(periodFilter);
    })
  }, [data, periodFilter, startRangeDate, endRangeDate])

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return (
    <Box {...props}>
      <Box className="flex flex-col justify-start ml-5 mt-3 mb-5">
        <Typography className="font-bold! text-xl!">
           {t("lastTransactions")}
        </Typography>
        <Typography>{t("lastTransactionsLabel")}</Typography>
      </Box>
      <TableContainer component={Paper} className="max-h-80.5">
        <Table className="min-w-full" aria-label="Últimas transações">
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold!">{t("date")}</TableCell>
              <TableCell className="font-semibold!">{t("description")}</TableCell>
              <TableCell className="font-semibold!" align="right">
                {t("amount")}
              </TableCell>
              <TableCell className="font-semibold!" align="right">
                {t("method")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              !error &&
              filteredData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((datas) => {
                  return (
                    <TableRow key={datas.id}>
                      <TableCell>
                        {new Date(datas.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                      </TableCell>
                      <TableCell>{datas.name}</TableCell>
                      <TableCell
                        className={`font-[540]! ${datas?.type === "INCOME" ? "text-green-500!" : "text-red-500!"}`}
                        align="right"
                      >
                        {datas?.type === "INCOME" ? "+" : "-"}
                        {formattedValue.format(datas.amount)}
                      </TableCell>
                      <TableCell align="right">{datas.method}</TableCell>
                      <TableCell className="w-5!" align="right">
                        <Button
                          size="small"
                          aria-controls={open ? 'split-button-menu' : undefined}
                          aria-expanded={open ? 'true' : undefined}
                          aria-label="select merge strategy"
                          aria-haspopup="menu"
                          onClick={(event) => {
                            setSelectId(datas.id)
                            setTransactionToEdit(datas)
                            handleOnToggle(event)
                            }}
                        >
                          <MoreHorizIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )})}
          </TableBody>
        </Table>
                      <Popper
                    
                        open={open}
                        anchorEl={anchorEl}
                        transition
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom'
                            }}
                          >
                            <Paper>
                              <ClickAwayListener onClickAway={handleClose}>
                                  <MenuList id="split-button-menu" autoFocusItem>
                                    { options.map ((option, index) => (
                                      <MenuItem
                                        key={option}
                                        selected={index === selectedIndex}
                                        onClick={(event) => {
                                          handleMenuItemclick(event, index)
                                          if(option === "Apagar") {
                                            deleteTransaction(selectId)
                                          }
                                          if(option === "Editar" && transactionToEdit?.type === "INCOME") {
                                            setIsIncomeModalOpen(true)
                                          }
                                          if(option === "Editar" && transactionToEdit?.type === "EXPENSE") {
                                            setIsExpenseModalOpen(true)
                                          }

                                        }}
                                      >
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>

                      <IncomeModal 
                        open={isIncomeModalOpen}
                        onClose={() => {
                          setIsIncomeModalOpen(false);
                          setTransactionToEdit(null)
                        }}                      
                        transactionToEdit={transactionToEdit}
                      />
                      <ExpenseModal
                        open={isExpenseModalOpen}
                        onClose={() => {
                          setIsExpenseModalOpen(false);
                          setTransactionToEdit(null)
                        }}                      
                        transactionToEdit={transactionToEdit}
                      />
      </TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={t("linesPerPage")}
              labelDisplayedRows={({ from, to, count }) => {
                return `${from}-${to} ${t("of")} ${count !== -1 ? `${count} ${t("transactions")}` : `${t("moreThan")} ${to}`}`;
              }}
            />
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};
