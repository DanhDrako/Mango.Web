import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps
} from '@mui/material';
import {
  useController,
  type FieldValues,
  type UseControllerProps
} from 'react-hook-form';

type Props<T extends FieldValues> = {
  label: string;
  name: keyof T;
  items: { key: number; label: string }[];
} & UseControllerProps<T> &
  Partial<SelectProps>;

export default function AppSelectInput<T extends FieldValues>(props: Props<T>) {
  const { fieldState, field } = useController({ ...props });
  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        value={field.value || ''}
        label={props.label}
        onChange={field.onChange}
      >
        {props.items.map((item, index) => (
          <MenuItem value={item.key} key={index}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
