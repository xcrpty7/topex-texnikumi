import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/courses', { params });
    return { courses: res.data.data, meta: res.data.meta };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchCourseBySlug = createAsyncThunk('courses/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const res = await api.get(`/courses/${slug}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createCourse = createAsyncThunk('courses/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/courses', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('Course created!');
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to create course');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCourse = createAsyncThunk('courses/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/courses/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('Course updated!');
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteCourse = createAsyncThunk('courses/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/courses/${id}`);
    toast.success('Course deleted!');
    return id;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to delete');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const enrollCourse = createAsyncThunk('courses/enroll', async (id, { rejectWithValue }) => {
  try {
    await api.post(`/courses/${id}/enroll`);
    toast.success('Enrolled successfully!');
    return id;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Enrollment failed');
    return rejectWithValue(err.response?.data?.message);
  }
});

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    list: [],
    current: null,
    meta: null,
    loading: false,
    error: null,
    filters: { page: 1, limit: 12, category: '', level: '', search: '' },
  },
  reducers: {
    setFilters: (state, { payload }) => { state.filters = { ...state.filters, ...payload }; },
    clearCurrent: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true; })
      .addCase(fetchCourses.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = payload.courses;
        state.meta = payload.meta;
      })
      .addCase(fetchCourses.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(fetchCourseBySlug.pending, (state) => { state.loading = true; })
      .addCase(fetchCourseBySlug.fulfilled, (state, { payload }) => { state.loading = false; state.current = payload; })
      .addCase(fetchCourseBySlug.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(createCourse.fulfilled, (state, { payload }) => { state.list.unshift(payload); })
      .addCase(deleteCourse.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((c) => c._id !== payload);
      });
  },
});

export const { setFilters, clearCurrent } = coursesSlice.actions;
export default coursesSlice.reducer;
