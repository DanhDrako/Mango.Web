import { z } from 'zod';

const passwordValidation = new RegExp(
  /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
);

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().regex(passwordValidation, {
    message:
      'Password must contain 1 lowercase character, 1 uppercase character, 1 number, 1 special and be 6-10 characters'
  }),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  role: z.string().min(1, 'At least one role is required')
});

export type RegisterSchema = z.infer<typeof registerSchema>;
