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
        <Box component={Paper} className="ml-5 mt-10 w-30 h-221.7 flex flex-col items-center">
            <Box className="p-2 mt-5 ml-3">
                <AccountCircleIcon sx={{ 
                    fontSize: '70px',
                    color: ""
                }}/>
            </Box>
            <Box className="mt-20 h-90 flex flex-col justify-around">
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
    )
}