"use client"

import { useState } from "react";
import { Box, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import ContentCard from "./ContentCard";


const Content = () => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const handleClose = () => setDialogOpen(false);
    const handleOpen = () => setDialogOpen(true);
    const handleSave = async () => {

        if (!title.trim()) {
            alert("Please enter the content title")
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum`, {
                method: "POST",
                body: JSON.stringify({ title }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Content added successfully");
                setTitle("");
                handleClose();
            } else {
                alert("Error adding content");
            }
        } catch (error) {
            alert("error occured, please try again");
        }
    };

    return (

        <>

            <Box

                sx={{

                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    padding: 2,
                    backgroundColor: "white"

                }}

            >

                <TextField
                    variant="outlined"
                    placeholder="Search Your Content"



                />
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "white",
                        ":hover": { backgroundColor: "black" },
                        whiteSpace: "nowrap",
                        padding: "12px 24px",
                        fontSize: "1.1rem",
                        color: "black",
                    }}
                    onClick={handleOpen}
                >

                    Add Content

                </Button>




            </Box>

            <Dialog

                open={dialogOpen}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
            >

                <DialogTitle color="black">Add New Content</DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        label="Content Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleClose}
                        sx={{
                            color: "black",
                            backgroundColor: "white",
                            ":hover": { backgroundColor: "blue" },
                        }}

                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            color: "black",
                            backgroundColor: "white",
                            ":hover": { backgroundColor: "blue" },
                        }}

                    >
                        Save
                    </Button>

                </DialogActions>
            </Dialog >
            <ContentCard />
        </>
    )
}

export default Content;