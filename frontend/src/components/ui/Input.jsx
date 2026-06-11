const Input = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-accent">{label}</label>}
    <input className={`input-field ${error ? 'border-red-500/60 focus:border-red-500' : ''} ${className}`} {...props} />
    {error && <p className="text-red-400 text-sm">{error}</p>}
  </div>
);

export default Input;
