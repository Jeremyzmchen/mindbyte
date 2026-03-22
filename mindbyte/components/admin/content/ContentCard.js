"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import SourceIcon from "@mui/icons-material/Source";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import {
    Box, Button, Typography, IconButton, Tooltip, Grid, Dialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField, CircularProgress,
} from "@mui/material";

const ContentCard = () => {
    const router = useRouter();
    const [content, setContent] = useState([])
    const [hoverIndex, setHoverIndex] = useState(null)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [currentContent, setCurrentContent] = useState(null)
    const [newTitle, setNewTitle] = useState("")
    const [actionLoading, setActionLoading] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum`)
            const data = await res.json()
            console.log("content data", data)
            setContent(data)
        } catch (error) {
            console.log(error)
            toast.error("Error fetching content")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70vh",
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    mb: 2,
                }}
            >

                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={fetchContent}
                    disabled={loading}
                    sx={{
                        backgroundColor: "green",
                        ":hover": {
                            backgroundColor: "red",
                            opacity: 0.8
                        }
                    }}


                >
                    {loading ? <CircularProgress size={20} /> : "Reload"}
                </Button>
            </Box>

            {
                content.map((content, index) => (
                    <Box
                        key={content?._id}
                        sx={{
                            padding: 2,
                            mt: 2,
                            backgroundColor: "white",
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                                cursor: "pointer",
                            },
                            width: "100%",
                        }}

                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}

                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "100px",
                                            height: "100px",
                                            backgroundColor: "green",
                                            borderRadius: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontSize: "0.8rem",
                                                color: "black",

                                            }}
                                        >
                                            Image
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "black",
                                        }}
                                    >{content?.title}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">{content?.description}</Typography>
                            </Grid>

                            <Grid

                                item xs={6}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}>

                                {hoverIndex === index ? (
                                    <Box
                                        variant="contained"
                                        color="success"
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                        }}
                                    >
                                        <Tooltip
                                            title="Source"
                                        >
                                            <IconButton size="large"
                                                sx={{
                                                    color: "red"
                                                }}
                                                onClick={() => router.push(`/dashboard/admin/create/content/curriculumeditorcontent?search=${content?._id}`)}
                                            >
                                                <SourceIcon fontSize="2.5rem" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip
                                            title="Edit"
                                        >
                                            <IconButton size="large"
                                                sx={{
                                                    color: "green"
                                                }}
                                                //onClick={() => handleEditOpen(content)}
                                            >
                                                <EditIcon fontSize="2.5rem" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip
                                            title="Delete"
                                        >
                                            <IconButton size="large"
                                                sx={{
                                                    color: "purple"
                                                }}
                                                //onClick={() => handleEditOpen(content)}
                                            >
                                                <DeleteForeverIcon fontSize="2.5rem" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                ) : (<Typography
                                    variant="body1"
                                    color="black"
                                    sx={{
                                        fontWeight: "bold"
                                    }}
                                >Finish Your Topic</Typography>)}

                            </Grid>
                        </Grid>

                    </Box>
                ))


            }
        </>
    )
};

export default ContentCard;