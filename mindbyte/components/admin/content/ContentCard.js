"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArticleIcon from "@mui/icons-material/Article";

import {
    Box, Typography, IconButton, Tooltip, Dialog,
    DialogActions, DialogContent, DialogTitle,
    TextField, CircularProgress, Button,
} from "@mui/material";

const C = {
    card: "#ffffff",
    primary: "#111827",
    text: "#111827",
    text_secondary: "#6b7280",
    label: "#9ca3af",
    border: "#e5e7eb",
    hover_bg: "#f9fafb",
};

const ContentCard = ({ search = "" }) => {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchCourses(); }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum`);
            const data = await res.json();
            setCourses(data);
        } catch (error) {
            toast.error("Error fetching courses");
        } finally {
            setLoading(false);
        }
    };

    const filtered = courses.filter(c =>
        c?.title?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDeleteConfirm = async () => {
        try {
            setActionLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/${currentCourse?._id}`, { method: "DELETE" });
            if (res.ok) {
                setCourses(prev => prev.filter(c => c?._id !== currentCourse?._id));
                toast.success("Course deleted");
                setDeleteOpen(false);
            } else {
                toast.error("Failed to delete course");
            }
        } catch {
            toast.error("Failed to delete course");
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditSave = async () => {
        try {
            setActionLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum/${currentCourse?._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle }),
            });
            if (res.ok) {
                setCourses(prev => prev.map(c => c?._id === currentCourse?._id ? { ...c, title: newTitle } : c));
                toast.success("Course updated");
                setEditOpen(false);
            } else {
                toast.error("Failed to update course");
            }
        } catch {
            toast.error("Failed to update course");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
                <CircularProgress sx={{ color: C.primary }} />
            </Box>
        );
    }

    return (
        <>
            {/* ── 表格头 ── */}
            <Box
                sx={{
                    backgroundColor: C.card,
                    borderRadius: "12px",
                    border: `1px solid ${C.border}`,
                    overflow: "hidden",
                }}
            >
                {/* 列标题 */}
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 120px",
                    px: 3, py: 1.5,
                    borderBottom: `1px solid ${C.border}`,
                    backgroundColor: "#f9fafb",
                }}>
                    {["COURSE DETAILS", "CATEGORY", "STATUS", "ACTIONS"].map(h => (
                        <Typography key={h} sx={{ fontSize: 11, fontWeight: 700, color: C.label, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {h}
                        </Typography>
                    ))}
                </Box>

                {/* 数据行 */}
                {filtered.length === 0 ? (
                    <Box sx={{ px: 3, py: 6, textAlign: "center" }}>
                        <Typography sx={{ color: C.label, fontSize: 14 }}>No courses found.</Typography>
                    </Box>
                ) : (
                    filtered.map((course, index) => (
                        <Box
                            key={course?._id}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr 1fr 120px",
                                px: 3, py: 2,
                                alignItems: "center",
                                borderBottom: index < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                                "&:hover": { backgroundColor: C.hover_bg },
                                "&:hover .actions": { opacity: 1 },
                                transition: "background-color 0.15s ease",
                            }}
                        >
                            {/* Course Details */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{
                                    width: 56, height: 36,
                                    borderRadius: "6px",
                                    backgroundColor: "#f3f4f6",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                }}>
                                    <ArticleIcon sx={{ fontSize: 18, color: C.primary }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.text }}>{course?.title}</Typography>
                                    <Typography sx={{ fontSize: 11, color: C.label }}>Click to edit curriculum</Typography>
                                </Box>
                            </Box>

                            {/* Category */}
                            <Box>
                                <Typography sx={{
                                    display: "inline-block",
                                    fontSize: 11, fontWeight: 700,
                                    px: 1.5, py: 0.4, borderRadius: "999px",
                                    backgroundColor: "#f3f4f6", color: C.text_secondary,
                                    textTransform: "uppercase", letterSpacing: "0.04em",
                                }}>
                                    Course
                                </Typography>
                            </Box>

                            {/* Status */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#22c55e" }} />
                                <Typography sx={{ fontSize: 13, color: C.text_secondary, fontWeight: 500 }}>Published</Typography>
                            </Box>

                            {/* Actions */}
                            <Box className="actions" sx={{ display: "flex", gap: 0.5, opacity: 0, transition: "opacity 0.15s ease" }}>
                                <Tooltip title="Edit Curriculum">
                                    <IconButton
                                        size="small"
                                        onClick={() => router.push(`/dashboard/admin/create/content/curriculumeditorcontent?search=${course?._id}`)}
                                        sx={{ color: C.label, "&:hover": { color: C.text, backgroundColor: "#f3f4f6" } }}
                                    >
                                        <ArticleIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Title">
                                    <IconButton
                                        size="small"
                                        onClick={() => { setCurrentCourse(course); setNewTitle(course?.title); setEditOpen(true); }}
                                        sx={{ color: C.label, "&:hover": { color: C.text, backgroundColor: "#f3f4f6" } }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        size="small"
                                        onClick={() => { setCurrentCourse(course); setDeleteOpen(true); }}
                                        sx={{ color: C.text_secondary, "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" } }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            {/* 底部 */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.label, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Showing {filtered.length} of {courses.length} courses
                </Typography>
                <Tooltip title="Refresh">
                    <IconButton
                        onClick={fetchCourses}
                        size="small"
                        sx={{ color: C.label, "&:hover": { color: C.text, backgroundColor: "#f3f4f6" } }}
                    >
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* ── Delete Dialog ── */}
            <Dialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                PaperProps={{ sx: { borderRadius: "14px", border: `1px solid ${C.border}`, boxShadow: "0px 12px 32px rgba(20,27,43,0.10)" } }}
            >
                <DialogTitle sx={{ fontSize: 17, fontWeight: 700, color: C.text }}>Delete Course</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontSize: 14, color: C.text_secondary }}>
                        Are you sure you want to delete <strong>"{currentCourse?.title}"</strong>? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setDeleteOpen(false)} sx={{ color: C.text_secondary, textTransform: "none", borderRadius: "8px" }}>Cancel</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        disabled={actionLoading}
                        sx={{ backgroundColor: "#ef4444", color: "#fff", textTransform: "none", borderRadius: "8px", px: 3, "&:hover": { backgroundColor: "#dc2626" } }}
                    >
                        {actionLoading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Edit Dialog ── */}
            <Dialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: "14px", border: `1px solid ${C.border}`, boxShadow: "0px 12px 32px rgba(20,27,43,0.10)" } }}
            >
                <DialogTitle sx={{ fontSize: 17, fontWeight: 700, color: C.text }}>Edit Course Title</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Course Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        autoFocus
                        sx={{
                            mt: 1,
                            "& .MuiOutlinedInput-root": { borderRadius: "8px", "&.Mui-focused fieldset": { borderColor: C.primary } },
                            "& label.Mui-focused": { color: C.primary },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setEditOpen(false)} sx={{ color: C.text_secondary, textTransform: "none", borderRadius: "8px" }}>Cancel</Button>
                    <Button
                        onClick={handleEditSave}
                        disabled={actionLoading}
                        sx={{
                            background: "#111827",
                            color: "#fff", textTransform: "none", borderRadius: "8px", px: 3,
                            boxShadow: "none", "&:hover": { opacity: 0.9 },
                        }}
                    >
                        {actionLoading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ContentCard;
