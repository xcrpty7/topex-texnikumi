const variants = {
  primary: 'bg-secondary/20 text-secondary border border-secondary/30',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  neutral: 'bg-white/10 text-accent border border-white/20',
};

const Badge = ({ children, variant = 'neutral', className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;
