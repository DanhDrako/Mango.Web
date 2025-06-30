import { useUserInfoQuery } from '../../features/auth/authApi';

export const useInfo = () => {
  const { data: responseUserInfo } = useUserInfoQuery();
  // Always call hooks at the top level
  const userDto = responseUserInfo?.result ?? null;
  return { userDto };
};
