"use client"

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ToastContainer } from "react-toastify";     
import "react-toastify/dist/ReactToastify.css";      

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <Provider store={store}>
                        {children}
                        <ToastContainer />     
                    </Provider>
                </SessionProvider>
            </body>
        </html>
    );
}