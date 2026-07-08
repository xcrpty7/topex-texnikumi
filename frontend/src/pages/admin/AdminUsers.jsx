import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Search, UserCheck, UserX, Trash2, RefreshCw, Users } from 'lucide-react';
import { fetchAdminUsers } from '../../features/admin/adminSlice';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { toast } from 'react-toastify';
import { timeAgo } from '../../utils/timeAgo';

const ROLE_STYLE = {
  SUPER_ADMIN: { color: '#DC2626', bg: '#2d0f0e' },
  ADMIN:       { color: '#D97706', bg: '#2d2000' },
  USER:        { color: '#2563EB', bg: '#EFF6FF' },
};

const ROLE_STATS_STYLE = [
  { role: 'USER',        color: '#2563EB', bg: '#EFF6FF' },
  { role: 'ADMIN',       color: '#D97706', bg: '#FEF3C7' },
  { role: 'SUPER_ADMIN', color: '#DC2626', bg: '#FEF2F2' },
];

const RoleBadge = ({ role }) => {
  const s = ROLE_STYLE[role] || { color: '#61677A', bg: '#E5E7EA' };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}
    >
      {role}
    </span>
  );
};

const AdminUsers = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { users, usersMeta, usersLoading: loading } = useSelector((s) => s.admin);
  const { user: me } = useSelector((s) => s.auth);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = (params = {}) => dispatch(fetchAdminUsers(params));

  useEffect(() => {
    load({ search, role: roleFilter, page: 1 });
  }, [search, roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    load({ search, role: roleFilter, page: 1 });
  };

  const handleToggleActive = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-block`);
      load({ search, role: roleFilter, page: usersMeta?.page });
      toast.success(t('adminUsers.statusUpdated'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin.error'));
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}`, { role });
      load({ search, role: roleFilter, page: usersMeta?.page });
      toast.success(t('adminUsers.roleUpdated'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmId) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/admin/users/${confirmId}`);
      toast.success(t('admin.deleted'));
      setConfirmId(null);
      load({ search, role: roleFilter, page: usersMeta?.page });
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin.error'));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>{t('adminUsers.pageTitle')}</title></Helmet>

      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px]" style={{ color: '#61677A' }}>~/admin/</span>
              <span className="font-mono text-sm font-semibold" style={{ color: '#16A34A' }}>users</span>
            </div>
            <p className="font-mono text-xs" style={{ color: '#61677A' }}>
              {usersMeta?.total ?? users.length} {t('adminUsers.usersCount')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {ROLE_STATS_STYLE.map(({ role, color, bg }) => {
                const cnt = users.filter(u => u.role === role).length;
                if (!cnt) return null;
                return (
                  <span
                    key={role}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background: bg, color }}
                  >
                    {role}: {cnt}
                  </span>
                );
              })}
            </div>

            <button
              onClick={() => load({ search, role: roleFilter })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs transition-colors"
              style={{ background: '#FFFFFF', color: '#61677A', border: '1px solid #E5E7EA' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#272829')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#61677A')}
            >
              <RefreshCw size={12} />
              {t('admin.refresh')}
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#61677A' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 font-mono text-[12px]"
              placeholder={t('adminUsers.searchPlaceholder')}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded font-mono text-xs transition-colors"
            style={{ background: '#DCFCE7', color: '#16A34A', border: '1px solid #272829' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F0FDF4')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#DCFCE7')}
          >
            {t('admin.search')}
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: '#61677A' }}>{t('adminUsers.role')}:</span>
          {['', 'USER', 'ADMIN', 'SUPER_ADMIN'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: roleFilter === r ? '#272829' : '#F1F2F4',
                color: roleFilter === r ? '#fff' : '#61677A',
              }}
            >
              {r || t('admin.filterAll')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <>
            <div className="glass-card overflow-x-auto">
              <table className="tm-table">
                <thead>
                  <tr>
                    <th>{t('adminUsers.table.user')}</th>
                    <th>{t('adminUsers.table.role')}</th>
                    <th>{t('adminUsers.table.status')}</th>
                    <th>{t('adminUsers.table.joined')}</th>
                    <th>{t('adminUsers.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs font-bold flex-shrink-0"
                            style={{ background: '#DCFCE7', color: '#16A34A' }}
                          >
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-[13px]" style={{ color: '#272829' }}>{user.name}</span>
                        </div>
                      </td>
                      <td><RoleBadge role={user.role} /></td>
                      <td>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px]"
                          style={{
                            background: user.isActive ? '#F0FDF4' : '#E5E7EA',
                            color: user.isActive ? '#16A34A' : '#61677A',
                            border: `1px solid ${user.isActive ? '#27282930' : '#D8D9DA'}`,
                          }}
                        >
                          <span style={{ fontSize: 7 }}>●</span>
                          {user.isActive ? t('adminUsers.active') : t('adminUsers.blocked')}
                        </span>
                      </td>
                      <td className="muted font-mono text-[10px]">
                        <span title={new Date(user.createdAt).toLocaleDateString(i18n.language === 'uz' ? 'uz-UZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US')}>
                          {timeAgo(user.createdAt, i18n.language)}
                        </span>
                      </td>
                      <td>
                        {me?._id !== user._id && user.role !== 'SUPER_ADMIN' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleActive(user._id)}
                              className="p-1.5 rounded transition-colors"
                              title={user.isActive ? t('adminUsers.block') : t('adminUsers.activate')}
                              style={{ color: user.isActive ? '#DC2626' : '#16A34A' }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = user.isActive ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              {user.isActive ? <UserX size={13} /> : <UserCheck size={13} />}
                            </button>

                            {me?.role === 'SUPER_ADMIN' && (
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                className="input-field py-1 px-2 font-mono text-[10px]"
                                style={{ width: 'auto', minWidth: 80 }}
                              >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                            )}

                            <button
                              onClick={() => setConfirmId(user._id)}
                              className="p-1.5 rounded transition-colors"
                              title={t('admin.delete')}
                              style={{ color: '#61677A' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#61677A'; e.currentTarget.style.background = 'transparent'; }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <Users size={36} style={{ color: '#D1D5DB' }} />
                          <p className="font-mono text-xs" style={{ color: '#9CA3AF' }}>
                            {roleFilter
                              ? t('adminUsers.filterEmpty', { role: roleFilter })
                              : t('adminUsers.empty')}
                          </p>
                          {roleFilter && (
                            <button
                              onClick={() => setRoleFilter('')}
                              className="font-mono text-xs px-3 py-1 rounded-lg transition-colors"
                              style={{ background: '#F1F2F4', color: '#61677A' }}
                            >
                              {t('admin.clearFilter')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {usersMeta && usersMeta.pages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono" style={{ color: '#61677A' }}>
                  {usersMeta.page}/{usersMeta.pages} {t('adminUsers.page')} · {usersMeta.total} {t('adminUsers.total')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => load({ search, role: roleFilter, page: usersMeta.page - 1 })}
                    disabled={usersMeta.page <= 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-colors disabled:opacity-40"
                    style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', color: '#272829' }}
                  >
                    {t('admin.prev')}
                  </button>
                  <button
                    onClick={() => load({ search, role: roleFilter, page: usersMeta.page + 1 })}
                    disabled={usersMeta.page >= usersMeta.pages}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-colors disabled:opacity-40"
                    style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', color: '#272829' }}
                  >
                    {t('admin.next')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title={t('adminUsers.confirmTitle')}
        message={t('adminUsers.confirmMessage')}
        confirmLabel={t('admin.deleteConfirm')}
        confirmStyle="danger"
      />
    </>
  );
};

export default AdminUsers;
