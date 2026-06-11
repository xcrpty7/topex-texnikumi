import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDashboard = createAsyncThunk('admin/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/stats');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/users', { params });
    return { users: res.data.data, meta: res.data.meta };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAdminApplications = createAsyncThunk('admin/fetchApplications', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/applications', { params });
    return { applications: res.data.data, meta: res.data.meta };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboard: null,
    users: [],
    usersMeta: null,
    usersLoading: false,
    applications: [],
    applicationsMeta: null,
    applicationsLoading: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearDashboard: (state) => { state.dashboard = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDashboard.fulfilled, (state, { payload }) => { state.loading = false; state.dashboard = payload; })
      .addCase(fetchDashboard.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(fetchAdminUsers.pending,   (state) => { state.usersLoading = true; })
      .addCase(fetchAdminUsers.fulfilled, (state, { payload }) => {
        state.usersLoading = false;
        state.users = payload.users;
        state.usersMeta = payload.meta;
      })
      .addCase(fetchAdminUsers.rejected,  (state) => { state.usersLoading = false; })

      .addCase(fetchAdminApplications.pending,   (state) => { state.applicationsLoading = true; })
      .addCase(fetchAdminApplications.fulfilled, (state, { payload }) => {
        state.applicationsLoading = false;
        state.applications = payload.applications;
        state.applicationsMeta = payload.meta;
      })
      .addCase(fetchAdminApplications.rejected,  (state) => { state.applicationsLoading = false; });
  },
});

export const { clearDashboard } = adminSlice.actions;
export default adminSlice.reducer;
