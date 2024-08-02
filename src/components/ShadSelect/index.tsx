import * as React from 'react';
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue } from '@/components/ui/select';
import { Controller } from 'react-hook-form';

interface ShadSelectProps {
  name: string;
  control: any;
  children: React.ReactNode;
  label?: string;
  placeholder?: string;
}

export const ShadSelect = ({ name, control, children, label, placeholder }: ShadSelectProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Select required value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {label && <SelectLabel>{label}</SelectLabel>}
              {children}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  );
};
