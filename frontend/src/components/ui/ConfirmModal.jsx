import { AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "O'chirish",
  confirmStyle = 'danger',
  loading = false,
}) => {
  if (!isOpen) return null;

  const isDanger = confirmStyle === 'danger';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl"
        style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: isDanger ? '#FEF2F2' : '#FEF3C7' }}
            >
              {isDanger ? (
                <Trash2 size={18} style={{ color: '#DC2626' }} />
              ) : (
                <AlertTriangle size={18} style={{ color: '#D97706' }} />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-base mb-1" style={{ color: '#272829' }}>
                {title}
              </h3>
              <p className="text-sm" style={{ color: '#61677A' }}>
                {message}
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ background: '#F1F2F4', color: '#61677A' }}
            >
              Bekor
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              style={{
                background: isDanger ? '#DC2626' : '#D97706',
                color: '#fff',
              }}
            >
              {loading ? 'Yuklanmoqda...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
