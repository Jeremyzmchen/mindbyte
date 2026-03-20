import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = '/api/admin/categoryWithSubs';

// 1. 获取所有条目
export const fetchItems = createAsyncThunk('items/fetch', async () => {
    const res = await fetch(BASE_URL);
    return res.json();
});

// 2. 保存条目：有 _id 就更新（PUT），没有就新增（POST）
export const saveItem = createAsyncThunk('items/save', async (item) => {
    const isEditing = !!item._id;
    const res = await fetch(
        isEditing ? `${BASE_URL}/${item._id}` : BASE_URL,
        {
            method: isEditing ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        }
    );
    return res.json();
});

// 3. 删除条目
export const deleteItem = createAsyncThunk('items/delete', async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    return id;
});

const itemSlice = createSlice({
    name: 'items',
    initialState: {
        items: [],
        editingItem: null,
        loading: false,
    },
    reducers: {
        // 同步操作：设置当前编辑的条目
        setEditingItem: (state, action) => {
            state.editingItem = action.payload;
        },
        // 同步操作：清空编辑状态
        resetEditingItem: (state) => {
            state.editingItem = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(saveItem.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i._id === action.payload._id);
                if (index !== -1) {
                    // 更新已有条目
                    state.items[index] = action.payload;
                } else {
                    // 新增条目插入到最前面
                    state.items.unshift(action.payload);
                }
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.items = state.items.filter(i => i._id !== action.payload);
            });
    },
});

export const { setEditingItem, resetEditingItem } = itemSlice.actions;
export default itemSlice.reducer;