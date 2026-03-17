import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = '/api/admin/category';

// 1. 获取所有分类
export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
    const res = await fetch(BASE_URL);
    return res.json();
});

// 2. 添加分类
export const addCategory = createAsyncThunk('categories/add', async (name) => {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    return res.json();
});

// 3. 更新分类
export const updateCategory = createAsyncThunk('categories/update', async ({ id, name }) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    return res.json();
});

// 4. 删除分类
export const deleteCategory = createAsyncThunk('categories/delete', async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    return id;
});

// Slice
const categorySlice = createSlice({
    name: 'categories',
    initialState: { list: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => { state.loading = true; })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.list.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.list = state.list.filter(c => c._id !== action.payload);
            });
    },
});

export default categorySlice.reducer;