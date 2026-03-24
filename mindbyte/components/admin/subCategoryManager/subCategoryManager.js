import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, Button,
    IconButton, InputAdornment,
    Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/slice/categorySlice';
import { fetchSubCategories, addSubCategory, updateSubCategory, deleteSubCategory } from '@/slice/subCategorySlice';

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
    "& .MuiInputLabel-root": { color: C.text_secondary },
};

const SubCategoryManager = () => {
    const dispatch = useDispatch();
    const { list: subCategories, loading } = useSelector((state) => state.subCategories);
    const { list: categories } = useSelector((state) => state.categories);
    const [selectedParent, setSelectedParent] = useState('');
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [newSubCategory, setNewSubCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editing, setEditing] = useState({ id: null, name: '' });

    useEffect(() => {
        dispatch(fetchSubCategories());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        setFilteredSubCategories(
            searchTerm === '' ? subCategories
                : subCategories.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [subCategories, searchTerm]);

    const handleSave = () => {
        if (!selectedParent) { alert('Please select a parent category'); return; }
        if (!newSubCategory.trim() && !editing.name?.trim()) { alert('Please enter a subcategory name'); return; }
        if (editing.id) {
            dispatch(updateSubCategory({ id: editing.id, name: editing.name }));
        } else {
            dispatch(addSubCategory({ name: newSubCategory, parent: selectedParent }));
        }
        setEditing({ id: null, name: '' });
        setNewSubCategory('');
        setSelectedParent('');
    };

    return (
        <Box sx={{ p: { xs: 3, md: 5 } }}>
            {/* ── 页面标题 ── */}
            <Box sx={{ mb: 5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.primary, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>
                    Admin / Create
                </Typography>
                <Typography sx={{ fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                    SubCategory Management
                </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 360px" }, gap: 4, alignItems: "start" }}>

                {/* ── 左：列表 ── */}
                <Box>
                    <TextField
                        fullWidth
                        placeholder="Search subcategories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search sx={{ color: C.label, fontSize: 20 }} /></InputAdornment>
                        }}
                        sx={{ ...inputSx, mb: 3 }}
                    />

                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.text, mb: 0.5 }}>Active SubCategories</Typography>
                    <Typography sx={{ fontSize: 13, color: C.text_secondary, mb: 2 }}>Showing {filteredSubCategories.length} total</Typography>

                    <Box sx={{ backgroundColor: C.card, borderRadius: "12px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
                        {loading ? (
                            <Box sx={{ p: 4, textAlign: "center" }}><Typography sx={{ color: C.label }}>Loading...</Typography></Box>
                        ) : filteredSubCategories.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: "center" }}><Typography sx={{ color: C.label, fontSize: 14 }}>No subcategories found.</Typography></Box>
                        ) : (
                            filteredSubCategories.map((sub, i) => (
                                <Box key={sub?._id} sx={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    px: 3, py: 2,
                                    borderBottom: i < filteredSubCategories.length - 1 ? `1px solid ${C.border}` : "none",
                                    "&:hover": { backgroundColor: C.hover_bg },
                                    "&:hover .sub-actions": { opacity: 1 },
                                    transition: "background-color 0.15s ease",
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Box sx={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Typography sx={{ fontSize: 16 }}>🏷️</Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.text }}>{sub?.name}</Typography>
                                    </Box>
                                    <Box className="sub-actions" sx={{ display: "flex", opacity: 0, transition: "opacity 0.15s" }}>
                                        <IconButton size="small" onClick={() => setEditing({ id: sub?._id, name: sub?.name })}
                                            sx={{ color: C.label, "&:hover": { color: C.text, backgroundColor: "#f3f4f6" } }}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => dispatch(deleteSubCategory(sub?._id))}
                                            sx={{ color: C.label, "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" } }}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>

                {/* ── 右：表单 ── */}
                <Box sx={{ backgroundColor: C.card, borderRadius: "12px", border: `1px solid ${C.border}`, p: 3 }}>
                    <Typography sx={{ fontSize: 17, fontWeight: 700, color: C.text, mb: 0.5 }}>
                        {editing.id ? "Edit SubCategory" : "Create New SubCategory"}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: C.text_secondary, mb: 3 }}>
                        Assign to a parent category.
                    </Typography>

                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.text, mb: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Parent Category
                    </Typography>
                    <FormControl fullWidth sx={{ ...inputSx, mb: 2.5 }}>
                        <InputLabel>Select Category</InputLabel>
                        <Select value={selectedParent} onChange={(e) => setSelectedParent(e.target.value)} label="Select Category">
                            <MenuItem value="">Select a category</MenuItem>
                            {categories?.map((cat) => (
                                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.text, mb: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        SubCategory Name
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="e.g. Machine Learning"
                        value={editing.id ? editing.name : newSubCategory}
                        onChange={(e) => editing.id
                            ? setEditing({ ...editing, name: e.target.value })
                            : setNewSubCategory(e.target.value)
                        }
                        sx={{ ...inputSx, mb: 3 }}
                    />

                    <Button fullWidth onClick={handleSave}
                        disabled={!newSubCategory?.trim() && !editing.name?.trim()}
                        sx={{
                            background: "#111827",
                            color: "#fff", fontWeight: 600, textTransform: "none",
                            borderRadius: "8px", py: 1.5, fontSize: 15,
                            boxShadow: "none", "&:hover": { opacity: 0.9 },
                            "&.Mui-disabled": { backgroundColor: "#f3f4f6", color: C.label },
                        }}>
                        {editing.id ? "Update SubCategory" : "Publish SubCategory"}
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

export default SubCategoryManager;
