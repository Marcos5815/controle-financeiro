'use client'

import { Button, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import AccountBoxIcon from '@mui/icons-material/AccountBox';import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const Sidebar = () => {

    const pathname = usePathname()
    
    const page = (path: string) => {
        const isActive = pathname === path
        return isActive ? "contained" : undefined;
    }

    const iconColor = (path: string) => {
        const isActive = pathname === path
        return isActive ? "sideBarActive.main" : "sideBarIconInactive.main";
    }


    return(
        <Box component={Paper} className="w-full h-13 fixed bottom-0 left-0 z-50 lg:left-0 lg:bottom-10 lg:w-22 lg:ml-5 lg:h-170 2xl:h-200 2xl:left-auto 2xl:bottom-auto 2xl:flex! 2xl:justify-center! 2xl:items-center! 2xl:mt-20">
            <Box className="flex flex-col justify-center items-center 2xl:h-full 2xl:justify-around">
                <Box className="hidden lg:p-2 lg:mt-5 lg:ml-3 lg:block">
                    <AccountCircleIcon sx={{ 
                        fontSize: '70px',
                        color: ""
                    }}/>
                </Box>
                <Box className="flex justify-center items-center gap-10 pt-2 lg:pt-0 sm:gap-25 mb-5 
                    lg:mt-20 lg:h-90 lg:flex-col lg:justify-around lg:items-center
                ">
                    <Link href="/profile">
                        <Button variant={page('/profile')} color='sideBarButton'><AccountBoxIcon sx={{ color: iconColor('/profile')}}/> </Button>
                    </Link>
                    <Link href="/finances">
                        <Button variant={page('/finances')} color='sideBarButton'><AccountBalanceWalletIcon sx={{ color: iconColor('/finances')}}/> </Button>
                    </Link>
                    <Link href="/mySettings">
                        <Button variant={page('/mySettings') || page('/mySettings/components/support') || page('/mySettings/components/language')  ? "contained" : undefined} color='sideBarButton'><SettingsIcon sx={{ color: pathname === '/mySettings'  || pathname ==='/mySettings/components/support' || pathname === '/mySettings/components/language' ? "sideBarActive.main" : "sideBarIconInactive.main"}}/></Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}