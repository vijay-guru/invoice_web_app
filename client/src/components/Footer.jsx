import { Box, CssBaseLine, Link, Typography } from '@mui/material'
import { FaMoneyBillWave } from 'react-icons/fa'

function Copyright() {
    return (
        <Typography variant="body2" align="center" sx={{ color: "#ffffff" }}>
            {"Copyright ©"}
            <Link color="inherit" href="https://www.github.com/vijay-guru">V - INVOICE</Link>
            {new Date().getFullYear()}
        </Typography>
    )
}
function Footer() {
    return (
        <Box sx={{
            position: "fixed",
            bottom: 0,
            width: "100%",
        }}>
            <CssBaseLine />
            <Box component="footer" sx={{
                py: 1,
                px: 1,
                mt: "auto",
                bgcolor: "#000000"
            }}>
                <Typography varient="subtitle1" align='center' component="p" sx={{ color: "#07f011" }}>
                    <FaMoneyBillWave />Because Money is as important as oxygen{" "}<FaMoneyBillWave />
                </Typography>
                <Copyright />
            </Box>
        </Box>
    )
}

export default Footer