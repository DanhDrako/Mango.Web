import { TextField, type TextFieldProps } from '@mui/material';
import {
  useController,
  type FieldValues,
  type UseControllerProps
} from 'react-hook-form';

type Props<T extends FieldValues> = {
  label: string;
  name: keyof T;
} & UseControllerProps<T> &
  TextFieldProps;

export default function AppTextInput<T extends FieldValues>(props: Props<T>) {
  const { fieldState, field } = useController({ ...props });
  return (
    <TextField
      {...field}
      {...props}
      multiline={props.multiline || false}
      rows={props.rows || 1}
      type={props.type || 'text'}
      fullWidth
      value={field.value || ''}
      variant="outlined"
      error={!!fieldState.error}
      helperText={fieldState.error ? fieldState.error.message : ''}
    />
  );
}
