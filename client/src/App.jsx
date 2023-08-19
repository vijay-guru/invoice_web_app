import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { Route,Routes } from "react-router-dom"
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Footer from './components/Footer'
import Layout from './components/Layout'
import NotFound from './components/NotFound'
import { customTheme } from "./customTheme"
import useTitle from "./hooks/useTitle"
import HomePage from "./pages/HomePage"
function App() {
  useTitle('V - Invoice Home')
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline>
        <Routes>
          <Route path="/" element={<Layout/>}/>
          <Route index element={<HomePage/>} />
          <Route path='*' element={<NotFound/>} />
        </Routes>
        <Footer/>
        <ToastContainer theme="dark" />
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App