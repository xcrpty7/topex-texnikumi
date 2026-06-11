import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    toast.success('Welcome to TOPEX!');
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || 'Registration failed';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    toast.success('Welcome back!');
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || 'Invalid credentials';
    toast.error(msg);
    return rejectWithValue(msg);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      if (payload.accessToken) {
        state.accessToken = payload.accessToken;
        try { localStorage.setItem('accessToken', payload.accessToken); } catch {}
      }
      if (payload.user) state.user = payload.user;
    },
    clearError: (state) => { state.error = null; },
    markInitialized: (state) => { state.initialized = true; },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.initialized = true;
      try { localStorage.removeItem('accessToken'); } catch {}
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, { payload }) => { state.loading = false; state.error = payload; };

    builder
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.isAuthenticated = true;
        state.initialized = true;
        try { localStorage.setItem('accessToken', payload.accessToken); } catch {}
      })
      .addCase(register.rejected, (state, { payload }) => { state.loading = false; state.error = payload; state.initialized = true; })

      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.isAuthenticated = true;
        state.initialized = true;
        try { localStorage.setItem('accessToken', payload.accessToken); } catch {}
      })
      .addCase(login.rejected, (state, { payload }) => { state.loading = false; state.error = payload; state.initialized = true; })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        try { localStorage.removeItem('accessToken'); } catch {}
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        try { localStorage.removeItem('accessToken'); } catch {}
      })

      .addCase(fetchMe.pending, pending)
      .addCase(fetchMe.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, clearError, markInitialized, clearAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
