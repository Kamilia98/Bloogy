import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  type SelectChangeEvent,
} from '@mui/material';
import { useId } from 'react';

interface OptionType<T> {
  value: T;
  label: string;
}

interface AppSelectProps<T extends string | number> {
  label: string;
  value: T;
  options: OptionType<T>[];
  onChange: (value: T) => void;
}

function AppSelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: AppSelectProps<T>) {
  const id = useId();

  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={`${id}-select`}
        label={label}
        value={value}
        onChange={(e: SelectChangeEvent<T>) => {
          onChange(e.target.value as T);
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default AppSelect;
