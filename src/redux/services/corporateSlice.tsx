import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import corporateServices from '../api/corporateServices';

// Async thunk to fetch all corporates
export const fetchAllCorporates = createAsyncThunk(
  'corporates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await corporateServices.getCorporate(); // Replace with your API endpoint
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch corporates');
    }
  }
);

// Async thunk to fetch all corporate by id

export const fetchCorporateById = createAsyncThunk(
  'corporates/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await corporateServices.getCorporatebyId(id); // Replace with your API endpoint
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch corporate');
    }
  }
);

// Initial state
const initialState = {
  corporates: [],
  corporate: {},
  isLoading: false,
  error: null,
};

// Corporate slice
const corporateSlice = createSlice({
  name: 'corporates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCorporates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCorporates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.corporates = action.payload;
      })
      .addCase(fetchAllCorporates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchCorporateById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCorporateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.corporate = action.payload;
      })
      .addCase(fetchCorporateById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default corporateSlice.reducer;
