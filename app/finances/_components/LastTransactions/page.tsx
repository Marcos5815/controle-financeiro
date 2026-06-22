"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useSearchParams } from "next/navigation";
import { IncomeModal } from "../modals/IncomeModal/page";
import { ExpenseModal } from '../modals/ExpenseModal/page';
import { useLanguage } from "@/contexts/languageContext/page";
import { useTransactions, TransactionsType } from "@/api/transactions";
import { useAuth } from "@clerk/nextjs";

const formattedValue = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

export const LastTransactions = ({ ...props }) => {
  const { userId } = useAuth()
  const {t} = useLanguage()
  const searchParams = useSearchParams()
  const { data, isLoading, error, mutateDeleteTransactions } = useTransactions(userId);

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  
  const periodFilter = searchParams.get('period')
  const startRangeDate = searchParams.get('start')
  const endRangeDate = searchParams.get('end')

  const options = [t("edit"), t("delete")]

  const [ transactionToEdit, setTransactionToEdit] = useState<TransactionsType | null>(null)

  const [ open, setOpen] = useState(false);
  const [ selectedIndex, setSelectedIndex ] = useState(0);
  const [ anchorEl, setAnchorEl ] = useState<HTMLElement | null>(null)
  const anchorRef = useRef<HTMLElement>(null)

  const [ selectId, setSelectId ] = useState<string>("")

  const [ isIncomeModalOpen, setIsIncomeModalOpen ] = useState(false)
  const [ isExpenseModalOpen, setIsExpenseModalOpen ] = useState(false)

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  

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
  
  const displayedData = isDesktop ? filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  : filteredData;
  

  return (
    <Box {...props}>
      <Box className="flex flex-col justify-start ml-5 lg:ml-33 mt-3 mb-5 xl:mb-0 xl:ml-3">
        <Typography className="font-bold! text-xl!">
           {t("lastTransactions")}
        </Typography>
        <Typography className="hidden lg:block">{t("lastTransactionsLabel")}</Typography>
      </Box>
      <TableContainer component={Paper} className="max-h-80 xl:max-h-74 lg:ml-30 xl:ml-0 overflow-y-auto">
        <Table className="w-full! lg:w-[85%]!" aria-label="Últimas transações">
          <TableHead className="hidden! lg:flex! lg:w-full! lg:grow!">
            <TableRow className="w-full! flex! justify-between!">
              <TableCell className="font-semibold! grow lg:w-10! xl:w-5!">{t("date")}</TableCell>
              <TableCell className="font-semibold! grow lg:w-35 xl:w-15!" align="left" >{t("description")}</TableCell>
              <TableCell className="font-semibold! grow lg:w-15 xl:w-5!" align="left">
                {t("amount")}
              </TableCell>
              <TableCell className="font-semibold! grow lg:w-20">
                {t("method")}
              </TableCell>
              <TableCell className="xl:w-20"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="h-full flex grow ">
            {!isLoading &&
              !error &&
              displayedData
                .map((datas) => {
                  return (
                    <TableRow className="flex! justify-center items-center last:mb-14! xl:last:mb-0!" key={datas.id}>
                      <TableCell className="flex flex-col grow h-20! lg:w-10! xl:w-27!">
                          <Typography color="typography01" className="text-[9px]! sm:hidden!">{datas.method_id.method}</Typography>
                          <Typography color="typography01" className="text-[14px] sm:hidden!">{datas.name}</Typography>
                          <Typography color="typography01" className="text-[9px]! sm:text-[15px]!">{new Date(datas.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</Typography>
                      </TableCell>
                      <TableCell className="hidden! sm:flex! sm:grow h-20! lg:w-35 xl:w-35!" align="left">
                        <Typography color="typography01 text-[15px]!">
                          {datas.name}
                        </Typography>
                      </TableCell>
                      <TableCell
                        className="flex! items-center! grow h-20! lg:w-15 xl:w-35!"
                        align="left"
                      >
                        <Typography 
                        color="typography01"
                        className={`font-[540]! text-[15px]! sm:text-[15px]! ${datas?.type === "income" ? "text-green-500!" : "text-red-500!"}`}
                        >
                          {datas?.type === "income" ? "+ " : "- "}{formattedValue.format(datas.amount)}</Typography>
                      </TableCell>
                      <TableCell className="text-[8px]! sm:text-[16px]! h-20! hidden! text-right sm:flex! sm:grow! lg:w-20 xl:w-29!">
                        <Typography color="typography01">
                          {datas.method_id.method}
                        </Typography>
                      </TableCell>
                      <TableCell className="flex grow h-20!" align="right">
                        <Button
                          size="small"
                          aria-controls={open ? 'split-button-menu' : undefined}
                          aria-expanded={open ? 'true' : undefined}
                          aria-label="select merge strategy"
                          aria-haspopup="menu"
                          sx={{color: "typography01.main"}}
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
                                            mutateDeleteTransactions(selectId)
                                          }
                                          if(option === "Editar" && transactionToEdit?.type === "income") {
                                            setIsIncomeModalOpen(true)
                                          }
                                          if(option === "Editar" && transactionToEdit?.type === "expense") {
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
      <Table className="hidden! xl:block!">
        <TableBody >
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
