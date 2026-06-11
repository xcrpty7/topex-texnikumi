import Spinner from './Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'btn-orange',
    navy:    'btn-navy',
    outline: 'btn-outline',
    ghost:   'btn-ghost',
    white:   'btn-white',
    danger:  'btn bg-red-500 hover:bg-red-600 text-white px-6 py-3 shadow-sm',
  };
  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: '',
    lg: 'text-base px-8 py-4',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

export default Button;
