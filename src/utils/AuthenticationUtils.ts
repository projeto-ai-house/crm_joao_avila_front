export class AuthenticationUtils {
  private AUTH_TOKEN: string;

  constructor() {
    this.AUTH_TOKEN = import.meta.env.VITE_TOKEN_KEY || "auth_token";
  }

  public storegeToken(token: string): void {
    localStorage.setItem(this.AUTH_TOKEN, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN);
  }

  public removeToken(): void {
    localStorage.removeItem(this.AUTH_TOKEN);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}

// class AuthenticationUtils {
//   public static handler(token: string): {
//     encripted: string;
//     decoded: string;
//   } {
//     const encripted = this.encript(token);
//     const decoded = this.decode(encripted);
//     return { encripted, decoded };
//   }

//   private static encript(token: string): string {
//     const { spaceLength, divisor, rest } = this.defineIndexes(token);
//     const splitedToken: string[] = [];

//     let inputCount = 0;
//     for (let i = 0; i < token.length - rest; i += spaceLength) {
//       splitedToken.push(token.slice(i, i + spaceLength));
//       if (i + spaceLength < token.length) {
//         splitedToken.push(this.randomLetter());
//         inputCount++;
//       }
//     }

//     console.log(
//       `Input Count: ${inputCount}, Space Length: ${spaceLength}, Divisor: ${divisor}, Rest: ${rest}`
//     );

//     const encryptedToken =
//       splitedToken.join("") +
//       divisor.toString() +
//       rest.toString() +
//       "md-Va" +
//       inputCount.toString();

//     return encryptedToken;
//   }

//   private static decode(encryptedToken: string): string {
//     const tokenWithoutMetadata = encryptedToken.split("md-Va")[0];
//     const inputCount = Number(encryptedToken.split("md-Va")[1]);
//     const divisor = parseInt(tokenWithoutMetadata.slice(-2, -1), 10);
//     const rest = parseInt(tokenWithoutMetadata.slice(-1), 10);

//     const spaceLength =
//       (tokenWithoutMetadata.length - 2 - inputCount - rest) / divisor;
//     console.log(
//       `======>Input Count: ${inputCount}, Space Length: ${spaceLength}, Divisor: ${divisor}, Rest: ${rest}, `
//     );
//     const splitedToken: string[] = [];

//     for (let i = 0; i < tokenWithoutMetadata.length - 1; i += spaceLength + 1) {
//       splitedToken.push(tokenWithoutMetadata.slice(i, i + spaceLength));
//     }
//     return splitedToken.join("");
//   }

//   private static defineIndexes(string: string): {
//     spaceLength: number;
//     divisor: number;
//     rest: number;
//   } {
//     const stringLength = string.length;
//     let divisor = Math.floor(Math.random() * 9) + 1;
//     const rest = stringLength % divisor;
//     const spaceLength = (stringLength - rest) / divisor;

//     return { spaceLength, divisor, rest };
//   }

//   private static randomLetter(): string {
//     const letters =
//       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
//     const index = Math.floor(Math.random() * letters.length);
//     return letters[index];
//   }
// }

// console.log(AuthenticationUtils.handler("-----------------------------"));
