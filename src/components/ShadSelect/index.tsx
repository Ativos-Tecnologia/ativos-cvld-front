import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as React from 'react';
import { Controller } from 'react-hook-form';

interface ShadSelectProps {
  name: string;
  control: any;
  children: React.ReactNode;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
}

export const ShadSelect = ({ className, name, control, children, label, placeholder, defaultValue, required=false}: ShadSelectProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Select required={required} value={value} onValueChange={onChange} name={name} defaultValue={defaultValue} >
          <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup >
              {label && <SelectLabel>{label}</SelectLabel>}
              {children}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  );
};
