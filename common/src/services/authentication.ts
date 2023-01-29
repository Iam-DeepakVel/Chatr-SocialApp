// Crypto & Utils are inbuild modules
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// scrypt is not async ...so in this step we making it async with help of promisify from inbuilt util function
const scryptAsync = promisify(scrypt);

export class Authentication {
  // * To hash the password - During SignUp
  async pwdToHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buffer.toString("hex")}.${salt}}`;
  }

  // * To compare the password - During Signin
  async pwdCompare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buffer.toString("hex") === hashedPassword;
  }
}

// Exporting authenticationService instance of Class Authentication
export const authenticationService = new Authentication()
