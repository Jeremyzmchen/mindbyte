import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '@/slice/categorySlice';
import subCategoryReducer from '@/slice/subCategorySlice';
import itemsReducer from '@/slice/categoryWithSubsSlice';

export const store = configureStore({
    reducer: {
        categories: categoryReducer,
        subCategories: subCategoryReducer,
        items: itemsReducer,
    },
});