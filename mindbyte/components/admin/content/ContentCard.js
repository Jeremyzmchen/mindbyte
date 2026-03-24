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
    const [courses, setCourses] = useState([])
    const [hoverIndex, setHoverIndex] = useState(null)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [currentCourse, setCurrentCourse] = useState(null)
    const [newTitle, setNewTitle] = useState("")
    const [actionLoading, setActionLoading] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum`)
            const data = await res.json()
            console.log("courses data", data)
            setCourses(data)
        } catch (error) {
            console.log(error)
            toast.error("Error fetching courses")
        } finally {
            setLoading(false)
        }
    };

    const handleDeleteOpen = (course) => {
        setCurrentCourse(course);
        setDeleteOpen(true);
    }

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    }

    const handleDeleteConfirm = async () => {
        try {
            setActionLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/${currentCourse?._id}`,
                {
                    method: "DELETE",
                });

            if (res.ok) {
                setCourses((prev) => prev.filter((course) => course?._id !== currentCourse?._id));
                toast.success("Course deleted successfully");
                setDeleteOpen(false);
            } else {
                toast.error("Failed to delete course");
            }

        } catch (error) {
            console.log("failed to delete course")
            toast.error("Failed to delete course")
        } finally {
            setActionLoading(false);
        }
    }

    const handleEditOpen = (course) => {
        setCurrentCourse(course);
        setNewTitle(course?.title);
        setEditOpen(true);
    }

    const handleEditClose = () => {
        setEditOpen(false);
    }

    const handleEditSave = async () => {
        console.log("handleEditSave")
        try {
            setActionLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/${currentCourse?._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: newTitle,
                }),
            });

            console.log("res.status", res.status)
            console.log("res.ok", res.ok)          

            if (res.ok) {
                setCourses((prev) =>
                    prev.map((course) =>
                        course?._id === currentCourse?._id
                            ? { ...course, title: newTitle }
                            : course
                    )
                );
                console.log("Course update successfully")
                toast.success("Course update successfully")
                setEditOpen(false);
            } else {
                toast.error("Failed to update course");
                console.log("Failed to update course");
            }

        } catch (error) {
            console.log("Update course error", error)
            toast.error("Failed to update course", error)
        } finally {
            setActionLoading(false);
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
                    onClick={fetchCourses}
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
                courses.map((course, index) => (
                    <Box
                        key={course?._id}
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
                                    >{course?.title}</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="body1">{course?.description}</Typography>
                            </Grid>

                            <Grid
                                item xs={6}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                {hoverIndex === index ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                        }}
                                    >
                                        <Tooltip title="Source">
                                            <IconButton
                                                size="large"
                                                sx={{ color: "red" }}
                                                onClick={() => router.push(`/dashboard/admin/create/content/curriculumeditorcontent?search=${course?._id}`)}
                                            >
                                                <SourceIcon fontSize="2.5rem" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Edit">
                                            <IconButton
                                                size="large"
                                                sx={{ color: "green" }}
                                                onClick={() => handleEditOpen(course)}
                                            >
                                                <EditIcon fontSize="2.5rem" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Delete">
                                            <IconButton
                                                size="large"
                                                sx={{ color: "purple" }}
                                                onClick={() => handleDeleteOpen(course)}
                                            >
                                                <DeleteForeverIcon fontSize="2.5rem" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                ) : (
                                    <Typography
                                        variant="body1"
                                        color="black"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Finish Your Topic
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                ))
            }

            <Dialog
                PaperProps={{
                    sx: {
                        backgroundColor: "red",
                        color: "black",
                    }
                }}
                open={deleteOpen}
                onClose={handleDeleteClose}
            >
                <DialogTitle>Delete Course</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this course? "{currentCourse?.title}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>Cancel</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        sx={{
                            color: "black",
                            backgroundColor: "blue"
                        }}
                        disabled={actionLoading}
                    >
                        {actionLoading ? (
                            <CircularProgress size={20} color="red" />
                        ) : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                PaperProps={{
                    sx: {
                        backgroundColor: "red",
                        color: "black",
                    }
                }}
                maxWidth="lg"
                fullWidth
                open={editOpen}
                onClose={handleEditClose}
            >
                <DialogTitle>Edit Course</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Content Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}

                    >

                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button
                        onClick={handleEditSave}
                        sx={{
                            color: "black",
                            backgroundColor: "blue"
                        }}
                        disabled={actionLoading}
                    >
                        {actionLoading ? (
                            <CircularProgress size={20} color="red" />
                        ) : "Upate"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default ContentCard;