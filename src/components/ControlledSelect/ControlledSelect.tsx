import React from "react";
import {
  useController,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { FormErrorMessage, FormLabel, FormControl } from "@chakra-ui/react";
import { Select, Props as SelectProps, GroupBase, OnChangeValue } from "chakra-react-select";

interface ControlledSelectProps<
  FormValues extends FieldValues = FieldValues,
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
>
  extends Omit<SelectProps<Option, IsMulti, Group>, "name" | "defaultValue">,
    UseControllerProps<FormValues> {
  label?: string;
}

/**
 * An attempt to make a reusable chakra-react-select form component
 *
 * @param props - The combined props of the chakra-react-select component and the useController hook
 */
function ControlledSelect<
  FormValues extends FieldValues = FieldValues,
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  name,
  label,
  options,
  control,
  rules,
  shouldUnregister,
  ...selectProps
}: ControlledSelectProps<FormValues, Option, IsMulti, Group>) {
  const {
    field: { onChange, ...field },
    fieldState: { error },
  } = useController<FormValues>({
    name,
    control,
    rules,
    shouldUnregister,
  });

  const handleChange = (newValue: OnChangeValue<Option, IsMulti>, actionMeta: ActionMeta<Option>) => {

    const value = Array.isArray(newValue) ? newValue : [newValue];
    onChange(value);
  };

  return (
    <FormControl id={name} isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <Select<Option, IsMulti, Group>
        options={options}
        {...selectProps}
        {...field}
        onChange={handleChange}
        menuPosition="fixed"
      />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export default ControlledSelect;
