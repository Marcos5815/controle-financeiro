import { Box, Typography } from "@mui/material"

export const Header = () => {
    return (
        <Box className="flex justify-center h-full sm:h-100 md:h-150 lg:h-200">
            <Box className="border rounded-md w-full sm:w-50">
                <Typography color="typography010" className="">
                    Olá usuário
                </Typography>
            </Box>
        </Box>
    )
}