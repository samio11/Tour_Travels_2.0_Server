import config from "../config";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcrypt";
import { sendEmail } from "./sendEmail";
export const seedSuperAdmin = async () => {
  const existUser = await User.findOne({ email: config.SUPER_ADMIN_EMAIL });
  if (existUser) {
    console.log(`Super admin already exist`);
    return;
  }
  const hashPassword = await bcrypt.hash(
    config.SUPER_ADMIN_PASSWORD as string,
    Number(config.BCRYPT_SALT)
  );
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: config.SUPER_ADMIN_EMAIL as string,
  };
  const payload: Partial<IUser> = {
    name: "Samio Hasan",
    email: config.SUPER_ADMIN_EMAIL,
    password: hashPassword,
    role: Role.SUPER_ADMIN,
    auths: [authProvider],
  };
  const newSuperAdmin = await User.create(payload);
  if (newSuperAdmin) {
    console.log(`Super Admin Created Done`);
    await sendEmail({
      to: newSuperAdmin.email,
      subject: "Welcome To Tour And Travel 2.0",
      tempName: "welcome",
      tempData: {
        companyName: "Tour-Travels-2.0",
        bannerImageUrl:
          "https://www.shutterstock.com/image-photo/happy-traveler-woman-on-boat-260nw-2337247887.jpg",
        name: newSuperAdmin.name,
      },
    });
  }
};
