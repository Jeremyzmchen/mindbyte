"use client"

import React, { useState } from "react";
import { Button } from "@mui/material";
import LoginModal from "@/components/loginModal/login";


const SignInButton = ({ defaultTab = 0 }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                variant={defaultTab === 1 ? "contained" : "outlined"}
                onClick={() => setIsModalOpen(true)}
                sx={
                    defaultTab === 1
                        ? {
                              // Get started
                              backgroundColor: "#000",
                              color: "#fff",
                              fontWeight: 600,
                              textTransform: "none",
                              fontSize: 15,
                              borderRadius: 2,
                              px: 2.5,
                              boxShadow: "none",
                              "&:hover": {
                                  backgroundColor: "#222",
                                  boxShadow: "none",
                              },
                          }
                        : {
                              // Log in
                              color: "#000",
                              borderColor: "#ccc",
                              fontWeight: 500,
                              textTransform: "none",
                              fontSize: 15,
                              borderRadius: 2,
                              px: 2.5,
                              "&:hover": {
                                  borderColor: "#000",
                                  backgroundColor: "transparent",
                              },
                          }
                }
            >
                {defaultTab === 0 ? "Log in" : "Get started"}
            </Button>

            <LoginModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                defaultTab={defaultTab}
            />
        </>
    );
};

export default SignInButton;