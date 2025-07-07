import { useMemo } from "react";

type UseDropdownOptionsProps<T> = {
  data: T[];
  labelKey: keyof T;
  valueKey: keyof T;
};

export type Option = {
  label: string;
  value: string | number;
};

export function useDropdownOptions<T extends Record<string, any>>({
  data,
  labelKey,
  valueKey,
}: UseDropdownOptionsProps<T>): Option[] {
  return useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      label: String(item[labelKey]),
      value: String(item[valueKey]),
    }));
  }, [data, labelKey, valueKey]);
}
