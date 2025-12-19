"use client";
import React from "react"
import QueryProvider from "./react-query"
import { ThemeProvider } from "./theme"
import { Toaster } from "sonner";

const  Providers: React.FC<{children: React.ReactNode}> = ({children}) => {
    return(
        <QueryProvider> 
            <ThemeProvider
            attribute= "class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
                {children}
                <Toaster position="top-center" richColors/>
            </ThemeProvider>
        </QueryProvider>
    )
}

export default Providers;

