"use client"

import { useState } from "react";
import {
    Box, Typography, TextField, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ContentCard from "./ContentCard";

const C = {
    bg: "#f9fafb",
    card: "#ffffff",
    primary: "#111827",
    text: "#111827",
    text_secondary: "#6b7280",
    label: "#9ca3af",
    border: "#e5e7eb",
};

const Content = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [search, setSearch] = useState("");

    const handleClose = () => { setDialogOpen(false); setTitle(""); };
    const handleOpen = () => setDialogOpen(true);

    const handleSave = async () => {
        if (!title.trim()) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/curriculum`, {
                method: "POST",
                body: JSON.stringify({ title }),
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                setTitle("");
                handleClose();
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box sx={{ p: { xs: 3, md: 5 } }}>
            {/* ── 页面标题 ── */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 5 }}>
                <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.text_secondary, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>
                        Admin Console
                    </Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                        My Courses
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: C.text_secondary, mt: 0.5 }}>
                        Manage and curate your educational inventory with precision.
                    </Typography>
                </Box>
                <Button
                    onClick={handleOpen}
                    startIcon={<AddIcon />}
                    sx={{
                        background: "#111827",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 14,
                        px: 3,
                        py: 1.25,
                        borderRadius: "10px",
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": { opacity: 0.85 },
                    }}
                >
                    Add Content
                </Button>
            </Box>

            {/* ── 搜索栏 ── */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Search by title, instructor, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: C.label, fontSize: 20 }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: C.card,
                            borderRadius: "10px",
                            fontSize: 14,
                            "& fieldset": { borderColor: C.border },
                            "&:hover fieldset": { borderColor: "#374151" },
                            "&.Mui-focused fieldset": { borderColor: C.primary },
                        },
                    }}
                />
            </Box>

            {/* ── 课程列表 ── */}
            <ContentCard search={search} />

            {/* ── 新增课程 Dialog ── */}
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "14px",
                        boxShadow: "0px 12px 32px rgba(20,27,43,0.10)",
                        border: `1px solid ${C.border}`,
                    }
                }}
            >
                <DialogTitle sx={{ fontSize: 18, fontWeight: 700, color: C.text, pb: 1 }}>
                    Add New Course
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Course Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        sx={{
                            mt: 1,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                "&.Mui-focused fieldset": { borderColor: C.primary },
                            },
                            "& label.Mui-focused": { color: C.primary },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button
                        onClick={handleClose}
                        sx={{ color: C.text_secondary, fontWeight: 500, textTransform: "none", borderRadius: "8px", px: 2.5 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        sx={{
                            background: "#111827",
                            color: "#fff",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: "8px",
                            px: 3,
                            boxShadow: "none",
                            "&:hover": { opacity: 0.9 },
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Content;
