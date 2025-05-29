import {
  TextField,
  InputAdornment,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { cloneElement, isValidElement, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  type?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  type,
  placeholder,
  label,
  leftIcon,
  rightIcon,
  error,
  onChange,
}: InputProps) {
  const leftAdornment =
    isValidElement(leftIcon) &&
    cloneElement(leftIcon as React.ReactElement<any>, {
      style: {
        ...((leftIcon.props && (leftIcon.props as any).style) || {}),
        marginRight: 8,
        color: '#6b7280',
      },
    });

  const rightAdornment =
    isValidElement(rightIcon) &&
    cloneElement(rightIcon as React.ReactElement<any>, {
      style: {
        ...((rightIcon.props && (rightIcon.props as any).style) || {}),
        marginLeft: 8,
        color: '#6b7280',
      },
    });

  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={Boolean(error)}
      sx={{ mb: 2 }}
    >
      <TextField
        type={type}
        placeholder={placeholder}
        label={label}
        error={Boolean(error)}
        onChange={onChange}
        slotProps={{
          input: {
            startAdornment: leftAdornment ? (
              <InputAdornment position="start">{leftAdornment}</InputAdornment>
            ) : undefined,

            endAdornment: rightAdornment ? (
              <InputAdornment position="end">{rightAdornment}</InputAdornment>
            ) : undefined,
          },
        }}
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormHelperText>{error}</FormHelperText>
          </motion.div>
        )}
      </AnimatePresence>
    </FormControl>
  );
}
