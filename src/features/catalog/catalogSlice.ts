import { createSlice } from '@reduxjs/toolkit';
import type { ProductParams } from '../../app/models/productParams';

// This slice manages the state for product parameters in the catalog feature
// It includes pagination, sorting, searching, and filtering options

// The initial state is set with default values for page number, page size, order by field, search term, and empty arrays for brands and types
const initialState: ProductParams = {
  pageNumber: 1,
  pageSize: 8,
  orderBy: 'name',
  searchTerm: '',
  brands: [],
  types: []
};

// The catalogSlice is created using createSlice from Redux Toolkit
// It defines the name of the slice, the initial state, and the reducers to handle state changes
// Each reducer updates the state based on the action payload and resets the page number when certain parameters change
export const catalogSlice = createSlice({
  name: 'catalogSlice',
  initialState,
  reducers: {
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload; // Update page number based on action payload
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload; // Update page size based on action payload
    },

    setOrderBy: (state, action) => {
      state.orderBy = action.payload; // Update order by field based on action payload
      state.pageNumber = 1; // Reset page number when order changes
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.pageNumber = 1; // Reset page number when search term changes
    },
    setBrands: (state, action) => {
      state.brands = action.payload;
      state.pageNumber = 1; // Reset page number when brands change
    },
    setTypes: (state, action) => {
      state.types = action.payload;
      state.pageNumber = 1; // Reset page number when types change
    },
    resetParam() {
      return initialState; // Reset to initial state
    }
  }
});

export const {
  setPageNumber,
  setPageSize,
  setOrderBy,
  setSearchTerm,
  setBrands,
  setTypes,
  resetParam
} = catalogSlice.actions; // Export actions for use in components
