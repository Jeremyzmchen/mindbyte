import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '@/slice/categorySlice';

const CategoryManager = () => {
    const dispatch = useDispatch();
    const { list: categories, loading } = useSelector((state) => state.categories);

    const [newCategory, setNewCategory] = useState('');
    const [editing, setEditing] = useState({ id: null, name: '' });

    // 页面加载时获取所有分类
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

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
        <Box p={3} maxWidth="600px" mx="auto">
            <Typography variant="h4" gutterBottom>
                Category Manager
            </Typography>

            {/* 输入框 + 按钮 */}
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
                />
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!newCategory.trim() && !editing.name.trim()}
                >
                    {editing.id ? 'Update' : 'Add'}
                </Button>
            </Box>

            {/* 分类列表 */}
            <List>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    categories?.map((category) => (
                        <ListItem key={category._id} divider>
                            <ListItemText primary={category.name} />
                            <IconButton onClick={() => setEditing({ id: category._id, name: category.name })}>
                                <Edit style={{ color: 'green' }} />
                            </IconButton>
                            <IconButton color="error" onClick={() => dispatch(deleteCategory(category._id))}>
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