// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { RoutingLayout } from './routes/RoutingLayout'
// import '@mantine/core/styles.css';

// import { MantineProvider } from '@mantine/core';
// import { BrowserRouter } from 'react-router-dom'

// function App() {
 
//   return (
//     <>
//     <MantineProvider>
//       <BrowserRouter>
//      <RoutingLayout/>
//      </BrowserRouter>
//      </MantineProvider>
//     </>
//   )
// }

// export default App

import "./App.css";
import { RoutingLayout } from "./routes/RoutingLayout";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkTokenExpiration } from "./utils/TokenExpiration";
import { logoutAuth } from "./redux/features/auth/authSlice";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material";

function App() {

  const theme = createTheme({
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
  });

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ThemeProvider theme={theme}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <RoutingLayout />
      </ThemeProvider>
    </MantineProvider>
  );
}

export default App;

