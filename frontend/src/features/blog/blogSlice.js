import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

export const fetchArticles = createAsyncThunk('blog/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/blog', { params });
    return { articles: res.data.data, meta: res.data.meta };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchArticleBySlug = createAsyncThunk('blog/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    const res = await api.get(`/blog/${slug}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createArticle = createAsyncThunk('blog/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/blog', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success('Article created!');
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteArticle = createAsyncThunk('blog/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/blog/${id}`);
    toast.success('Article deleted!');
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const blogSlice = createSlice({
  name: 'blog',
  initialState: { list: [], current: null, meta: null, loading: false, error: null },
  reducers: {
    clearCurrentArticle: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => { state.loading = true; })
      .addCase(fetchArticles.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = payload.articles;
        state.meta = payload.meta;
      })
      .addCase(fetchArticles.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchArticleBySlug.pending, (state) => { state.loading = true; })
      .addCase(fetchArticleBySlug.fulfilled, (state, { payload }) => { state.loading = false; state.current = payload; })
      .addCase(fetchArticleBySlug.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(createArticle.fulfilled, (state, { payload }) => { state.list.unshift(payload); })
      .addCase(deleteArticle.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((a) => a._id !== payload);
      });
  },
});

export const { clearCurrentArticle } = blogSlice.actions;
export default blogSlice.reducer;
