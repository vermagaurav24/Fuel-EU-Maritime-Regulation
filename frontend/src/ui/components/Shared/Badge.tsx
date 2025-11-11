import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info';
}

export default function Badge({ children, variant = 'info' }: BadgeProps) {
  return (
    <span
      className={clsx('px-2 py-1 text-xs font-medium rounded-full', {
        'bg-green-100 text-green-800': variant === 'success',
        'bg-red-100 text-red-800': variant === 'danger',
        'bg-yellow-100 text-yellow-800': variant === 'warning',
        'bg-blue-100 text-blue-800': variant === 'info',
      })}
    >
      {children}
    </span>
  );
}