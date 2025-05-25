import React from 'react';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { red } from '@mui/material/colors';
import type { SxProps } from '@mui/material';

interface OptionType<T> {
  value: T;
  label: string;
  sx?: SxProps; // or `SxProps` for full MUI styling support
}
  

interface AppSelectProps<T> {
  label: string;
  value: T;
  options: OptionType<T>[];
  onChange: (value: T) => void;
  className?: string;
}

function AppSelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
}: AppSelectProps<T>) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <Select
        value={value}
        onChange={(_, newValue) => {
          if (newValue !== null) onChange(newValue);
        }}
        indicator={<KeyboardArrowDown />}
        className={className}
        sx={{
          [`& .${selectClasses.indicator}`]: {
            transition: '0.2s',
            [`&.${selectClasses.expanded}`]: {
              transform: 'rotate(-180deg)',
            },
          },
        }}
      >
        {options.map((opt) => (
          <Option key={String(opt.value)} value={opt.value} sx={opt.sx}>
            {opt.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default AppSelect;
