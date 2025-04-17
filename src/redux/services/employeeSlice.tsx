import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import employeeServices from '../api/employeeServices';

// Async thunk to fetch all corporates
export const fetchAllEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeServices.getEmployees(); // Replace with your API endpoint
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch Employees');
    }
  }
);

// Async thunk to fetch employee by id
export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchbyId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeeServices.getEmployeebyId(id); // Replace with your API endpoint
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch Employee');
    }
  }
);
// Async thunk to fetch all corporates for employees
export const fetchAllCorporatesForEmployees = createAsyncThunk(
  'employees/fetchAllCorporates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeServices.getCorporatesForEmployees(); // Replace with your API endpoint
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch corporates for employees');
    }
  }
);

// Initial state
const initialState = {
  employees: [],
  employee: {},
  corporates: [],
  isLoading: false,
  error: null,
};

// Corporate slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchAllCorporatesForEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCorporatesForEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.corporates = action.payload;
      })
      .addCase(fetchAllCorporatesForEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchEmployeeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;
