/* eslint-disable no-unused-vars */
import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";

import { Checkbox } from "../../components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { cn } from '@/lib/utils'
import { InputFieldVariant } from "@/enums/inputFieldVariants.enum";
import { CelerInputFormFieldProps } from "@/interfaces/ICelerInputFormField";
import Cleave from "cleave.js/react";


const RenderInput = ({ field, props }: { field: any; props: CelerInputFormFieldProps }) => {
  switch (props.fieldType) {
    case InputFieldVariant.INPUT:
      return (
        <div className="flex rounded-md gap-4">
          {props.iconSrc && (
            <div className="flex items-center">
              {props.iconSrc}
            </div>
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className={cn(`shad-input border-0 bg-snow`, props.className)}
              defaultValue={props.defaultValue}
            />
          </FormControl>
        </div>
      );
    case InputFieldVariant.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            required={props.required}
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case InputFieldVariant.NUMBER:
      return (
        <FormControl>
          <Cleave
            {...field}
            defaultValue={props.defaultValue}
            className={`w-full rounded-md border-stroke px-3 py-3 text-sm font-medium dark:bg-boxdark-2 dark:border-strokedark dark:text-bodydark`}
            options={{
              numeral: true,
              numeralThousandsGroupStyle: "thousand",
              numeralDecimalScale: 2,
              numeralDecimalMark: ",",
              delimiter: ".",
              prefix: props.currencyFormat || "",
              rawValueTrimPrefix: true,
            }}
          />
        </FormControl>
      );
    case InputFieldVariant.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="BR"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );
    case InputFieldVariant.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value || props.defaultValue}
              onCheckedChange={field.onChange}
              className="border-1 relative box-border block cursor-pointer appearance-none rounded-md border-[#d9d9d9] bg-slate-200 transition-all duration-300 before:absolute before:left-2/4 before:top-[42%] before:h-[10px] before:w-[6px] before:-translate-x-2/4 before:-translate-y-2/4 before:rotate-45 before:scale-0 before:border-b-2 before:border-r-2 before:border-solid before:border-b-white before:border-r-white before:opacity-0 before:transition-all before:delay-100 before:duration-100 before:ease-in before:content-[''] after:absolute after:inset-0 after:rounded-[7px] after:opacity-0 after:shadow-[0_0_0_calc(30px_/_2.5)_#1677ff] after:transition-all after:duration-500 after:ease-in after:content-[''] checked:border-transparent checked:bg-[#1677ff] checked:before:-translate-x-2/4 checked:before:-translate-y-2/4 checked:before:rotate-45 checked:before:scale-x-[1.4] checked:before:scale-y-[1.4] checked:before:opacity-100 checked:before:transition-all checked:before:delay-100 checked:before:duration-200 checked:before:ease-in hover:border-[#1677ff] focus:outline-[#1677ff] [&:active:not(:checked)]:after:opacity-100 [&:active:not(:checked)]:after:shadow-none [&:active:not(:checked)]:after:transition-none"
            />
            <label htmlFor={props.name} className="checkbox-label text-sm font-semibold">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case InputFieldVariant.DATE:
      return (
        <div className="flex rounded-md relative">
          <FormControl>
            <Cleave
              {...field}
              defaultValue={props.defaultValue}
              className={`w-full rounded-md border-stroke px-3 py-3 text-sm font-medium dark:bg-boxdark-2 dark:border-strokedark dark:text-bodydark`}
              options={{
                date: true,
                datePattern: ["d", "m", "Y"],
                delimiter: "/"
              }}
            />
          </FormControl>

          <Image
            src="/assets/icons/calendar.svg"
            height={16}
            width={16}
            alt="calendar"
            className="absolute right-3 top-3.5"
          />
        </div>
      );
    case InputFieldVariant.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} value={field.value || props.defaultValue} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger h-11">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case InputFieldVariant.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CelerInputFormField = (props: CelerInputFormFieldProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      rules={props.rules}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== InputFieldVariant.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CelerInputFormField;
