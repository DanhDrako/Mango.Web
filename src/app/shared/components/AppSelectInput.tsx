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

type ItemObject = { key: string | number; label: string };
type ItemsType = string[] | ItemObject[];

type Props<T extends FieldValues> = {
  label: string;
  name: keyof T;
  items: ItemsType;
} & UseControllerProps<T> &
  Partial<SelectProps>;

export default function AppSelectInput<T extends FieldValues>(props: Props<T>) {
  const { fieldState, field } = useController({ ...props });

  // Helper to render MenuItems for both string[] and ItemObject[]
  const renderMenuItems = () => {
    if (
      props.items.length > 0 &&
      typeof props.items[0] === 'object' &&
      props.items[0] !== null
    ) {
      // items is ItemObject[]
      return (props.items as ItemObject[]).map((item, index) => (
        <MenuItem value={item.key} key={index}>
          {item.label}
        </MenuItem>
      ));
    } else {
      // items is string[]
      return (props.items as string[]).map((item, index) => (
        <MenuItem value={item} key={index}>
          {item}
        </MenuItem>
      ));
    }
  };

  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        value={field.value || ''}
        label={props.label}
        onChange={field.onChange}
      >
        {renderMenuItems()}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
