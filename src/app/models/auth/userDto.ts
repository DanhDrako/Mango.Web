export interface UserDto {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
}
export type Address = {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};
