
  
  declare type IUser = {
  _id: string;
  email: string;
  fullname?: string;
  firstName: string;
  lastName: string;
  password: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  userBio: string;
  role: "user" | "admin" | "system";
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}


  declare type CreateUserParams = {
    email: string;
    fullname?: string;
    password: string;
    firstName?: string;
    lastName?: string;
    userBio?: string;
    isEmailVerified?: boolean;
  };
  

    
  declare type UpdateUserParams = {
    firstName: string;
    lastName: string;
    userBio?: string;
    email: string;
  };
  