"use client"

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeRegistry from "./ThemeRegistry"; 

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>             
                    <SessionProvider>
                        <Provider store={store}>
                            {children}
                            <ToastContainer />
                        </Provider>
                    </SessionProvider>
                </ThemeRegistry>           
            </body>
        </html>
    );
}