import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utlils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  loading?: boolean;
  label: string;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  danger: 'btn-danger',
};

export default function Button({
  icon,
  loading,
  label,
  variant = 'primary',
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn('btn', variantClasses[variant], props.className)}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
}
