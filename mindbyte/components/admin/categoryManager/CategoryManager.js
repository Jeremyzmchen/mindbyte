import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, Button,
    IconButton, List, ListItem, ListItemText, InputAdornment,
} from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '@/slice/categorySlice';

const CategoryManager = () => {
    const dispatch = useDispatch();
    const { list: categories, loading } = useSelector((state) => state.categories);

    const [filteredCategories, setFilteredCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editing, setEditing] = useState({ id: null, name: '' });

    // 页面加载时获取所有分类
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // 增删改查后，保持搜索词过滤状态
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredCategories(categories);
        } else {
            const filtered = categories.filter((cat) =>
                cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [categories, searchTerm]);

    const handleSaveCategory = () => {
        if (editing.id) {
            dispatch(updateCategory({ id: editing.id, name: editing.name }));
        } else {
            dispatch(addCategory(newCategory));
        }
        setEditing({ id: null, name: '' });
        setNewCategory('');
    };

    const handleDeleteCategory = (id) => {
        dispatch(deleteCategory(id));
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <Box p={3} maxWidth="900px" mx="auto">
            <Typography variant="h4" gutterBottom>
                Category Manager
            </Typography>

            {/* 搜索框 */}
            <Box display="flex" gap={2} mb={3}>
                <TextField
                    label="Search Categories"
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
                        input: { color: 'white' },
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
                <TextField
                    label={editing.id ? 'Edit Category' : 'Add Category'}
                    variant="outlined"
                    fullWidth
                    value={editing.id ? editing.name : newCategory}
                    onChange={(e) =>
                        editing.id
                            ? setEditing({ ...editing, name: e.target.value })
                            : setNewCategory(e.target.value)
                    }
                    slotProps={{
                        inputLabel: { style: { color: '#ebe8e3' } },
                    }}
                    sx={{
                        input: { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#555' },
                            '&:hover fieldset': { borderColor: '#ebe8e3' },
                            '&.Mui-focused fieldset': { borderColor: '#ebe8e3' },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSaveCategory}
                    disabled={!newCategory?.trim() && !editing.name.trim()}
                    sx={{ backgroundColor: '#ebe8e3' }}
                >
                    {editing.id ? 'Update' : 'Add'}
                </Button>
            </Box>

            {/* 分类列表 */}
            <List>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    filteredCategories?.map((category) => (
                        <ListItem
                            key={category?._id}
                            divider
                            sx={{
                                borderColor: '#555',
                                '&:hover': { backgroundColor: '#ebe8e3' },
                            }}
                        >
                            <ListItemText primary={category?.name} />
                            <IconButton onClick={() => setEditing({ id: category?._id, name: category?.name })}>
                                <Edit style={{ color: 'green' }} />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteCategory(category?._id)}>
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))
                )}
            </List>
        </Box>
    );
};

export default CategoryManager;