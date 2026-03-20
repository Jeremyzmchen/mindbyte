import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, TextField, MenuItem,
  Select, FormControl, InputLabel, Button,
  IconButton, List, ListItem, ListItemText,
  InputAdornment,
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import {
  fetchItems, saveItem, deleteItem,
  setEditingItem, resetEditingItem,
} from '@/slice/categoryWithSubsSlice';
import { fetchCategories } from '@/slice/categorySlice';
import { fetchSubCategories } from '@/slice/subCategorySlice';

const ItemManager = () => {
  const dispatch = useDispatch();

  const { items, editingItem, loading } = useSelector((state) => state.items);
  const { list: categories } = useSelector((state) => state.categories);
  const { list: subcategories } = useSelector((state) => state.subCategories);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  // 页面加载时获取所有分类和条目
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchItems());
  }, [dispatch]);

  // 编辑时回填表单
  useEffect(() => {
    if (editingItem) {
      setSelectedCategory(editingItem.categoryId._id);
      // 回填时根据 categoryId 加载对应子分类
      dispatch(fetchSubCategories(editingItem.categoryId._id));
      setSelectedSubcategory(editingItem.subcategoryId._id);
      setTitle(editingItem.title);
      setSubtitle(editingItem.subtitle);
    } else {
      resetForm();
    }
  }, [editingItem]);

  // 选择 Category 时联动加载对应子分类
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    dispatch(fetchSubCategories(categoryId));
  };

  // 保存或更新条目
  const handleSaveItem = () => {
    const item = {
      categoryId: selectedCategory,
      subcategoryId: selectedSubcategory,
      title,
      subtitle,
    };
    dispatch(saveItem(item)).then(() => {
      dispatch(fetchItems());
      resetForm();
    });
  };

  // 删除条目
  const handleDeleteItem = (id) => {
    dispatch(deleteItem(id)).then(() => dispatch(fetchItems()));
  };

  // 重置表单
  const resetForm = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setTitle('');
    setSubtitle('');
    dispatch(resetEditingItem());
  };

  // 搜索过滤
  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter((item) =>
        `${item.title} ${item.subtitle} ${item.categoryId.name} ${item.subcategoryId.name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  return (
    <Box p={3} maxWidth="600px" mx="auto">

      {/* 搜索框 */}
      <Typography variant="h4" gutterBottom>
        Item Manager
      </Typography>
      <TextField
        label="Search by Title, Subtitle, Category, Subcategory"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search style={{ color: '#555' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      {/* 表单 */}
      <Box display="flex" flexDirection="column" gap={2} mb={3}>

        {/* Category 下拉 */}
        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subcategory 下拉（未选 Category 时禁用） */}
        <FormControl fullWidth size="small" disabled={!selectedCategory}>
          <InputLabel>Subcategory</InputLabel>
          <Select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            label="Subcategory"
          >
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Title" value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth size="small"
        />
        <TextField
          label="Subtitle" value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          fullWidth size="small"
        />

        <Button
          variant="contained"
          onClick={handleSaveItem}
          disabled={!selectedCategory || !selectedSubcategory}
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: 15,
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#222', boxShadow: 'none' },
          }}
        >
          {editingItem ? 'Update Item' : 'Add Item'}
        </Button>
      </Box>

      {/* 条目列表 */}
      <List>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          filteredItems?.map((item) => (
            <ListItem key={item._id} divider>
              <ListItemText
                primary={item.title}
                secondary={
                  <>
                    <span style={{ display: 'block' }}>
                      <strong>Category:</strong> {item.categoryId.name}
                    </span>
                    <span>
                      <strong>Subcategory:</strong> {item.subcategoryId.name}
                    </span>
                  </>
                }
              />
              <IconButton onClick={() => dispatch(setEditingItem(item))}>
                <Edit style={{ color: 'green' }} />
              </IconButton>
              <IconButton color="error" onClick={() => handleDeleteItem(item._id)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default ItemManager;