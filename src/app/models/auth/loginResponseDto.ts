import type { UserDto } from './userDto';

export interface LoginResponseDto {
  user: UserDto;
  token: string;
}
