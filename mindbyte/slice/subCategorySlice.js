import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = '/api/admin/subcategory';

// 1. 获取所有分类
export const fetchSubCategories = createAsyncThunk('subcategories/fetch', async (categoryId) => {
    const url = categoryId ? `${BASE_URL}?parent=${categoryId}` : BASE_URL;
    const res = await fetch(url);
    return res.json();
});

// 2. 添加分类
export const addSubCategory = createAsyncThunk('subcategories/add', async ({ name, parent }) => {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parent }),
    });
    return res.json();
});

// 3. 更新分类
export const updateSubCategory = createAsyncThunk('subcategories/update', async ({ id, name }) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    return res.json();
});

// 4. 删除分类
export const deleteSubCategory = createAsyncThunk('subcategories/delete', async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    return id;
});

// Slice
const subCategorySlice = createSlice({
    name: 'subcategories',
    initialState: { list: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubCategories.pending, (state) => { state.loading = true; })
            .addCase(fetchSubCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(addSubCategory.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(updateSubCategory.fulfilled, (state, action) => {
                const index = state.list.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(deleteSubCategory.fulfilled, (state, action) => {
                state.list = state.list.filter(c => c._id !== action.payload);
            });
    },
});

export default subCategorySlice.reducer;