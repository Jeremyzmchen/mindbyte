import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, Button,
    IconButton, InputAdornment,
} from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '@/slice/categorySlice';

const C = {
    bg: "#f9fafb",
    card: "#ffffff",
    primary: "#111827",
    text: "#111827",
    text_secondary: "#6b7280",
    label: "#9ca3af",
    border: "#e5e7eb",
    hover_bg: "#f9fafb",
};

const inputSx = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: C.card,
        borderRadius: "8px",
        "& fieldset": { borderColor: C.border },
        "&:hover fieldset": { borderColor: "#374151" },
        "&.Mui-focused fieldset": { borderColor: C.primary },
    },
    "& label.Mui-focused": { color: C.primary },
};

const CategoryManager = () => {
    const dispatch = useDispatch();
    const { list: categories, loading } = useSelector((state) => state.categories);

    const [filteredCategories, setFilteredCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editing, setEditing] = useState({ id: null, name: '' });

    useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

    useEffect(() => {
        setFilteredCategories(
            searchTerm === '' ? categories
                : categories.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [categories, searchTerm]);

    const handleSave = () => {
        if (editing.id) {
            dispatch(updateCategory({ id: editing.id, name: editing.name }));
        } else {
            dispatch(addCategory(newCategory));
        }
        setEditing({ id: null, name: '' });
        setNewCategory('');
    };

    return (
        <Box sx={{ p: { xs: 3, md: 5 } }}>
            {/* ── 页面标题 ── */}
            <Box sx={{ mb: 5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.primary, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>
                    Admin / Create
                </Typography>
                <Typography sx={{ fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                    Category Management
                </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 360px" }, gap: 4, alignItems: "start" }}>

                {/* ── 左：分类列表 ── */}
                <Box>
                    {/* 搜索框 */}
                    <TextField
                        fullWidth
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search sx={{ color: C.label, fontSize: 20 }} /></InputAdornment>
                        }}
                        sx={{ ...inputSx, mb: 3 }}
                    />

                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.text, mb: 0.5 }}>
                        Active Categories
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: C.text_secondary, mb: 2 }}>
                        Showing {filteredCategories.length} total
                    </Typography>

                    <Box sx={{ backgroundColor: C.card, borderRadius: "12px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
                        {loading ? (
                            <Box sx={{ p: 4, textAlign: "center" }}>
                                <Typography sx={{ color: C.label }}>Loading...</Typography>
                            </Box>
                        ) : filteredCategories.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: "center" }}>
                                <Typography sx={{ color: C.label, fontSize: 14 }}>No categories found.</Typography>
                            </Box>
                        ) : (
                            filteredCategories.map((category, i) => (
                                <Box
                                    key={category?._id}
                                    sx={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        px: 3, py: 2,
                                        borderBottom: i < filteredCategories.length - 1 ? `1px solid ${C.border}` : "none",
                                        "&:hover": { backgroundColor: C.hover_bg },
                                        "&:hover .cat-actions": { opacity: 1 },
                                        transition: "background-color 0.15s ease",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Typography sx={{ fontSize: 16 }}>📂</Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.text }}>{category?.name}</Typography>
                                    </Box>
                                    <Box className="cat-actions" sx={{ display: "flex", opacity: 0, transition: "opacity 0.15s" }}>
                                        <IconButton size="small"
                                            onClick={() => setEditing({ id: category?._id, name: category?.name })}
                                            sx={{ color: C.label, "&:hover": { color: C.text, backgroundColor: "#f3f4f6" } }}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small"
                                            onClick={() => dispatch(deleteCategory(category?._id))}
                                            sx={{ color: C.label, "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" } }}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>

                {/* ── 右：添加/编辑表单 ── */}
                <Box sx={{ backgroundColor: C.card, borderRadius: "12px", border: `1px solid ${C.border}`, p: 3 }}>
                    <Typography sx={{ fontSize: 17, fontWeight: 700, color: C.text, mb: 0.5 }}>
                        {editing.id ? "Edit Category" : "Create New Category"}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: C.text_secondary, mb: 3 }}>
                        Define high-level grouping for courses.
                    </Typography>

                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.text, mb: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Category Name
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="e.g. Artificial Intelligence"
                        value={editing.id ? editing.name : newCategory}
                        onChange={(e) => editing.id
                            ? setEditing({ ...editing, name: e.target.value })
                            : setNewCategory(e.target.value)
                        }
                        sx={{ ...inputSx, mb: 3 }}
                    />

                    <Button
                        fullWidth
                        onClick={handleSave}
                        disabled={!newCategory?.trim() && !editing.name?.trim()}
                        sx={{
                            background: "#111827",
                            color: "#fff", fontWeight: 600, textTransform: "none",
                            borderRadius: "8px", py: 1.5, fontSize: 15,
                            boxShadow: "none", "&:hover": { opacity: 0.9 },
                            "&.Mui-disabled": { backgroundColor: "#f3f4f6", color: C.label },
                        }}
                    >
                        {editing.id ? "Update Category" : "Publish Category"}
                    </Button>

                    {editing.id && (
                        <Button fullWidth onClick={() => setEditing({ id: null, name: '' })}
                            sx={{ mt: 1.5, color: C.text_secondary, textTransform: "none", borderRadius: "8px" }}>
                            Cancel Edit
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default CategoryManager;
