import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 admin-theme">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(39,40,41,0.45)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`admin-modal-box relative w-full ${sizes[size]} p-6 z-10 max-h-[90vh] overflow-y-auto`}
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', borderRadius: 14, boxShadow: '0 20px 60px rgba(39,40,41,0.18)' }}
          >
            <div className="flex items-center justify-between mb-5 pb-3" style={{ borderBottom: '1px solid #F0F1F3' }}>
              <h2 className="text-lg font-bold" style={{ color: '#272829' }}>{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
                style={{ color: '#61677A' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F2F4'; e.currentTarget.style.color = '#272829'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#61677A'; }}
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
