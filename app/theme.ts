"use client";

import '@mui/material/styles';
import { PaletteMode } from '@mui/material';


declare module '@mui/material/styles' {
  interface Palette {
    sideBarButton: Palette['primary'];
    sideBarIconActive: Palette['primary'];
    sideBarIconInactive: Palette['primary'];
    typography01: Palette['primary'];
  }
  interface PaletteOptions {
    sideBarButton?: PaletteOptions['primary']
    sideBarIconActive?: PaletteOptions['primary']
    sideBarIconInactive?: PaletteOptions['primary']
    typography01?: PaletteOptions['primary']
    background01?: PaletteOptions['primary']
    sideBarUser? : PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    sideBarButton: true;
    sideBarIconActive: true;
    sideBarIconInactive: true;
    typography01: true;
    background01: true;
    sideBarUser: true;
  }
}

export const themeMode = (mode: PaletteMode) => ({
  palette: {
    mode,      
    primary: { 
      main: mode === "light" ? "#408A71" : "#000000" ,
    },
    background: {
      default: mode === "light" ? "#FFFFFF" : "#091413",
      paper: mode === "light" ? "#FFFFFF" : "#091413",
    },
    typography01: {
      main: mode === "light" ? "#000000" : "#FFFFFF",
    },
    background01: {
      main: mode === "light" ? "#FFFFFF" : "#091413", 
    },
  },
});

// export default theme;
