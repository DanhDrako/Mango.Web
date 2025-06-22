import SD from '../../common/utils/keys/SD';
import Cookies from 'js-cookie';

class TokenProvider {
  private constructor() {
    // Private constructor to prevent instantiation
  }
  public static setToken(token: string): void {
    Cookies.set(SD.TokenCookie, token, {
      expires: 7, // Token will expire in 7 days
      secure: true, // Use secure cookies in production
      sameSite: 'Strict' // Prevent CSRF attacks
    });
  }

  public static getToken(): string | null {
    const token = Cookies.get(SD.TokenCookie);
    return token ? token : null;
  }

  public static clearToken(): void {
    Cookies.remove(SD.TokenCookie);
  }
}
export default TokenProvider;
