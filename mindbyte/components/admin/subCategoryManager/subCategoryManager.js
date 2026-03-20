import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/slice/categorySlice';
import { fetchSubCategories, addSubCategory, updateSubCategory, deleteSubCategory } from '@/slice/subCategorySlice';
const SubCategoryManager = () => {
    const dispatch = useDispatch();
    const { list: subCategories, loading } = useSelector((state) => state.subCategories);
    const { list: categories } = useSelector((state) => state.categories);
    const [selectedParent, setSelectedParent] = useState('');

    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [newSubCategory, setNewSubCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editing, setEditing] = useState({ id: null, name: '' });

    // 页面加载时获取所有分类
    useEffect(() => {
        dispatch(fetchSubCategories());
        dispatch(fetchCategories());
    }, [dispatch]);

    // 增删改查后，保持搜索词过滤状态
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredSubCategories(subCategories);
        } else {
            const filtered = subCategories.filter((cat) =>
                cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSubCategories(filtered);
        }
    }, [subCategories, searchTerm]);

    const handleSaveSubCategory = () => {
        if (!selectedParent) {
            alert('Please select a parent category');
            return;
        }
        if (!newSubCategory.trim() && !editing.name?.trim()) {
            alert('Please enter a subcategory name');
            return;
        }
        if (editing.id) {
            dispatch(updateSubCategory({ id: editing.id, name: editing.name }));
        } else {
            dispatch(addSubCategory({ name: newSubCategory, parent: selectedParent }));
        }
        setEditing({ id: null, name: '' });
        setNewSubCategory('');
        setSelectedParent('');
    };

    const handleDeleteSubCategory = (id) => {
        dispatch(deleteSubCategory(id));
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <Box p={3} maxWidth="900px" mx="auto">
            <Typography variant="h4" gutterBottom>
                SubCategory Manager
            </Typography>

            {/* 搜索框 */}
            <Box display="flex" gap={2} mb={3}>
                <TextField
                    label="Search SubCategories"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search style={{ color: '#555' }} />
                                </InputAdornment>
                            ),
                        },
                        inputLabel: { style: { color: '#555' } },
                    }}
                    sx={{
                        input: { color: 'black' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#555' },
                            '&:hover fieldset': { borderColor: '#ebe8e3' },
                            '&.Mui-focused fieldset': { borderColor: '#ebe8e3' },
                        },
                    }}
                />
            </Box>

            {/* 添加 / 编辑输入框 */}
            <Box display="flex" gap={2} mb={3}>
                <FormControl fullWidth sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#8A12FC' },
                        '&:hover fieldset': { borderColor: '#8A12FC' },
                        '&.Mui-focused fieldset': { borderColor: '#8A12FC' },
                    },
                }}>
                    <InputLabel sx={{ color: '#8A12FC' }}>Parent Category</InputLabel>
                    <Select
                        value={selectedParent}
                        onChange={(e) => setSelectedParent(e.target.value)}
                        label="Parent Category"
                    >
                        <MenuItem value="">Select a category</MenuItem>
                        {categories?.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 子类输入框 */}
                <TextField
                    label={editing.id ? 'Edit SubCategory' : 'Add SubCategory'}
                    variant="outlined"
                    fullWidth
                    value={editing.id ? editing.name : newSubCategory}
                    onChange={(e) =>
                        editing.id
                            ? setEditing({ ...editing, name: e.target.value })
                            : setNewSubCategory(e.target.value)
                    }
                    slotProps={{
                        inputLabel: { style: { color: '#8A12FC' } },
                    }}
                    sx={{
                        input: { color: 'black' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#8A12FC' },
                            '&:hover fieldset': { borderColor: '#8A12FC' },
                            '&.Mui-focused fieldset': { borderColor: '#8A12FC' },
                        },
                    }}
                />

                <Button
                    variant="contained"
                    onClick={handleSaveSubCategory}
                    disabled={!newSubCategory?.trim() && !editing.name?.trim()}
                    sx={{ backgroundColor: '#8A12FC' }}
                >
                    {editing.id ? 'Update' : 'Add'}
                </Button>
            </Box>

            {/* 分类列表 */}
            <List>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    filteredSubCategories?.map((subcategory) => (
                        <ListItem
                            key={subcategory?._id}
                            divider
                            sx={{
                                borderColor: '#555',
                                '&:hover': { backgroundColor: '#ebe8e3' },
                            }}
                        >
                            <ListItemText primary={subcategory?.name} />
                            <IconButton onClick={() => setEditing({ id: subcategory?._id, name: subcategory?.name })}>
                                <Edit style={{ color: 'green' }} />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteSubCategory(subcategory?._id)}>
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))
                )}
            </List>
        </Box>
    );
};

export default SubCategoryManager;