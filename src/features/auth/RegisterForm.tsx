import { useForm } from 'react-hook-form';
import { useAssignRoleMutation, useRegisterMutation } from './authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registerSchema,
  type RegisterSchema
} from '../../lib/schemas/registerSchema';
import { LockOutlined } from '@mui/icons-material';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material';
import { Link } from 'react-router';
import AppSelectInput from '../../app/shared/components/AppSelectInput';
import type { ResponseDto } from '../../app/models/responseDto';
import SD from '../../common/utils/keys/SD';

export default function RegisterForm() {
  const [registerUser] = useRegisterMutation();
  const [assignRoleUser] = useAssignRoleMutation();
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isLoading }
  } = useForm({
    mode: 'onTouched',
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerUser(data).unwrap();
      await assignRoleUser(data).unwrap();
    } catch (error) {
      const res = error as { data: ResponseDto<object> };
      if (res.data.message && typeof res.data.message === 'string') {
        const errorArray = res.data.message.split(',');

        errorArray.forEach((e: string) => {
          if (e.includes('Password')) {
            setError('password', { message: e });
          } else if (e.includes('Username')) {
            setError('email', { message: e.replace('Username', 'Email') });
          }
        });
      }
    }
  };
  return (
    <Container component={Paper} maxWidth="sm" sx={{ borderRadius: 3 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={8}
      >
        <LockOutlined sx={{ mt: 3, color: 'secondary.main', fontSize: 40 }} />
        <Typography variant="h5">Register</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          width="100%"
          display="flex"
          flexDirection="column"
          gap={3}
          marginY={3}
        >
          <TextField
            fullWidth
            label="Email"
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
          <TextField
            fullWidth
            label="Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
          />
          <TextField
            fullWidth
            label="Phone Number"
            {...register('phoneNumber')}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
          />
          <AppSelectInput
            items={Object.values(SD.RolesUser)}
            control={control}
            name="role"
            label="Role"
          />
          <Button
            disabled={isLoading || !isValid}
            variant="contained"
            type="submit"
          >
            Register
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Already have an account?
            <Typography
              sx={{ ml: 3 }}
              component={Link}
              to="/login"
              color="primary"
            >
              Sign in here
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
