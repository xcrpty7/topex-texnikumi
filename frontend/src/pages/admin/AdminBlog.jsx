import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Upload, X, Search } from 'lucide-react';
import { fetchArticles, deleteArticle } from '../../features/blog/blogSlice';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || '';
const resolveImg = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/assets')) return url;
  return `${API_URL}${url}`;
};
const EMPTY_FORM = { title: '', content: '', excerpt: '', tags: '', isPublished: false, videoUrl: '', category: '' };

const RichEditor = ({ value, onChange }) => {
  const { t } = useTranslation();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    ref.current?.focus();
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const addLink = () => {
    const url = window.prompt(t('adminBlog.editor.linkPrompt'));
    if (url) exec('createLink', url);
  };

  const toolBtns = [
    { cmd: 'bold',                icon: 'B',   title: t('adminBlog.editor.bold'),              style: { fontWeight: 'bold' } },
    { cmd: 'italic',              icon: 'I',   title: t('adminBlog.editor.italic'),             style: { fontStyle: 'italic' } },
    { cmd: 'underline',           icon: 'U',   title: t('adminBlog.editor.underline'),          style: { textDecoration: 'underline' } },
    { cmd: 'insertUnorderedList', icon: '\u2022\u2014',  title: t('adminBlog.editor.unorderedList') },
    { cmd: 'insertOrderedList',   icon: '1.',  title: t('adminBlog.editor.orderedList') },
    { cmd: 'formatBlock',         icon: 'H2',  title: t('adminBlog.editor.heading'),            val: 'h2' },
    { cmd: 'formatBlock',         icon: 'P',   title: t('adminBlog.editor.paragraph'),          val: 'p' },
    { cmd: 'removeFormat',        icon: 'T\u00d7',  title: t('adminBlog.editor.clearFormat') },
  ];

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-1 flex-wrap p-2 bg-gray-50 border-b border-gray-200">
        {toolBtns.map(({ cmd, icon, title, style, val }, index) => (
          <button
            key={index}
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); if (val) exec(cmd, val); else exec(cmd); }}
            className="px-2 py-1 rounded text-xs font-mono transition-colors hover:bg-gray-200"
            style={{ color: '#272829', ...style }}
          >
            {icon}
          </button>
        ))}
        <button
          type="button"
          title={t('adminBlog.editor.addLink')}
          onMouseDown={(e) => { e.preventDefault(); addLink(); }}
          className="px-2 py-1 rounded text-xs font-mono transition-colors hover:bg-gray-200"
          style={{ color: '#2563EB' }}
        >
          🔗
        </button>
        <div className="ml-auto text-[10px] text-gray-400 pr-1">{t('adminBlog.editor.htmlEditor')}</div>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
        onBlur={() => { if (ref.current) onChange(ref.current.innerHTML); }}
        className="min-h-[280px] p-4 outline-none text-sm leading-relaxed"
        style={{ color: '#272829', background: '#fff' }}
      />
    </div>
  );
};

const AdminBlog = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { list: articles, loading } = useSelector((s) => s.blog);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef();
  const blobUrl = useRef(null);

  useEffect(() => () => { if (blobUrl.current) URL.revokeObjectURL(blobUrl.current); }, []);

  useEffect(() => {
    dispatch(fetchArticles({ limit: 50 }));
  }, [dispatch]);

  const filtered = articles.filter(a => {
    const q = searchQ.toLowerCase();
    const matchSearch = !q || a.title?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q);
    const matchCat = catFilter === 'all' || a.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
      const url = URL.createObjectURL(f);
      blobUrl.current = url;
      setFile(f);
      setPreview(url);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview(null);
    setModal(true);
  };

  const openEdit = (article) => {
    setEditing(article._id);
    setForm({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      tags: article.tags?.join(', ') || '',
      isPublished: article.isPublished,
      videoUrl: article.videoUrl || '',
      category: article.category || '',
    });
    setPreview(resolveImg(article.image));
    setFile(null);
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);

    try {
      if (editing) {
        await api.put(`/blog/${editing}`, fd);
        toast.success(t('adminBlog.toast.updated'));
      } else {
        await api.post('/blog', fd);
        toast.success(t('adminBlog.toast.created'));
      }
      setModal(false);
      dispatch(fetchArticles({ limit: 50 }));
    } catch (err) {
      toast.error(err.response?.data?.message || t('adminBlog.toast.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await dispatch(deleteArticle(confirmId)).unwrap();
      toast.success(t('adminBlog.toast.deleted'));
    } catch {
      toast.error(t('adminBlog.toast.error'));
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.patch(`/blog/${id}/publish`);
      dispatch(fetchArticles({ limit: 50 }));
    } catch (err) {
      toast.error(t('adminBlog.toast.error'));
    }
  };

  const categoryConfig = [
    { value: 'Yangiliklar', label: t('adminBlog.categories.yangiliklar') },
    { value: "E'lonlar", label: t('adminBlog.categories.elonlar') },
    { value: 'Maqolalar', label: t('adminBlog.categories.maqolalar') },
    { value: 'Tadbirlar', label: t('adminBlog.categories.tadbirlar') },
  ];

  return (
    <>
      <Helmet><title>{t('adminBlog.pageTitle')}</title></Helmet>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#272829' }}>{t('adminBlog.header')}</h1>
            <p className="text-xs" style={{ color: '#61677A' }}>{t('adminBlog.articlesCount', { filtered: filtered.length, total: articles.length })}</p>
            <div className="flex gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: '#DCFCE7', color: '#16A34A' }}>
                {articles.filter(a => a.isPublished).length} {t('adminBlog.published')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: '#F1F2F4', color: '#61677A' }}>
                {articles.filter(a => !a.isPublished).length} {t('adminBlog.draft')}
              </span>
            </div>
          </div>
          <Button onClick={openCreate} size="sm"><Plus size={16} /> {t('admin.create')}</Button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder={t('adminBlog.searchPlaceholder')}
              className="pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', color: '#272829', width: 240 }}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCatFilter('all')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: catFilter === 'all' ? '#272829' : '#F1F2F4',
                color: catFilter === 'all' ? '#fff' : '#61677A',
              }}
            >
              {t('adminBlog.all')}
            </button>
            {categoryConfig.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCatFilter(cat.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: catFilter === cat.value ? '#272829' : '#F1F2F4',
                  color: catFilter === cat.value ? '#fff' : '#61677A',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-xl"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}
          >
            <Search size={32} style={{ color: '#9CA3AF' }} className="mb-3" />
            <p className="text-sm" style={{ color: '#61677A' }}>{t('adminBlog.notFound')}</p>
          </div>
        ) : (
          <div className="glass-card overflow-x-auto">
            <table className="tm-table">
              <thead>
                <tr>
                  {[t('adminBlog.table.image'), t('adminBlog.table.title'), t('adminBlog.table.category'), t('adminBlog.table.status'), t('adminBlog.table.views'), t('adminBlog.table.actions')].map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((article) => (
                  <tr key={article._id}>
                    <td style={{ width: 48 }}>
                      {article.image ? (
                        <img
                          src={resolveImg(article.image)}
                          alt={article.title}
                          className="w-10 h-10 rounded-lg object-cover"
                          style={{ border: '1px solid #E5E7EA' }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: '#F1F2F4', border: '1px solid #E5E7EA' }}
                        >
                          <span style={{ color: '#9CA3AF', fontSize: 11 }}>N/A</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <p className="text-[13px] font-medium" style={{ color: '#272829' }}>{article.title}</p>
                      <p className="font-mono text-[10px] mt-0.5" style={{ color: '#61677A' }}>
                        {article.author?.name}
                      </p>
                    </td>
                    <td>
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded"
                        style={{ background: '#E5E7EA', color: '#61677A', border: '1px solid #D8D9DA' }}
                      >
                        {article.category || '\u2014'}
                      </span>
                    </td>
                    <td>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px]"
                        style={article.isPublished
                          ? { background: '#F0FDF4', color: '#16A34A', border: '1px solid #27282930' }
                          : { background: '#E5E7EA', color: '#61677A', border: '1px solid #D8D9DA' }}
                      >
                        {article.isPublished ? t('adminBlog.statusPublished') : t('adminBlog.statusDraft')}
                      </span>
                    </td>
                    <td className="muted font-mono text-[11px]">{article.views || 0}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePublish(article._id)}
                          className="p-1.5 rounded transition-colors"
                          title={article.isPublished ? t('adminBlog.tooltip.hide') : t('adminBlog.tooltip.publish')}
                          style={{ color: article.isPublished ? '#D97706' : '#16A34A' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = article.isPublished ? 'rgba(217,119,6,0.08)' : 'rgba(22,163,74,0.08)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          {article.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <a
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded transition-colors"
                          style={{ color: '#61677A' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#61677A'; e.currentTarget.style.background = 'transparent'; }}
                          title={t('adminBlog.tooltip.viewOnSite')}
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          onClick={() => openEdit(article)}
                          className="p-1.5 rounded transition-colors"
                          style={{ color: '#61677A' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#61677A'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setConfirmId(article._id)}
                          className="p-1.5 rounded transition-colors"
                          style={{ color: '#61677A' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#61677A'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? t('adminBlog.modalEdit') : t('adminBlog.modalAdd')} size="xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="w-32 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors"
              style={{ borderColor: preview ? '#272829' : '#D8D9DA', background: '#FFFFFF' }}
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={20} style={{ color: '#9CA3AF' }} />
                  <span className="text-[10px] mt-1" style={{ color: '#61677A' }}>{t('adminBlog.form.coverImage')}</span>
                </>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-mono mb-2" style={{ color: '#61677A' }}>{t('adminBlog.form.coverImageHint')}</p>
              <Button type="button" variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
                {t('adminBlog.form.selectImage')}
              </Button>
              {preview && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                  className="ml-2 p-1.5 rounded-lg transition-colors"
                  style={{ color: '#DC2626', background: 'rgba(220,38,38,0.08)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          <Input label={t('adminBlog.form.title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required minLength={5} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-accent">{t('adminBlog.form.category')}</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {categoryConfig.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <Input label={t('adminBlog.form.videoUrl')} value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder={t('adminBlog.form.videoUrlPlaceholder')} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium" style={{ color: '#272829' }}>{t('adminBlog.form.content')}</label>
            <RichEditor value={form.content} onChange={(v) => setForm(f => ({ ...f, content: v }))} />
          </div>
          <Input label={t('adminBlog.form.excerpt')} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} maxLength={500} />
          <Input label={t('adminBlog.form.tags')} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder={t('adminBlog.form.tagsPlaceholder')} />
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="rounded" />
            <span className="text-accent text-sm">{t('adminBlog.form.publishNow')}</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>{t('common.cancel')}</Button>
            <Button type="submit" loading={saving}>{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={t('adminBlog.confirmTitle')}
        message={t('adminBlog.confirmMessage')}
        confirmLabel={t('adminBlog.confirmLabel')}
      />
    </>
  );
};

export default AdminBlog;
