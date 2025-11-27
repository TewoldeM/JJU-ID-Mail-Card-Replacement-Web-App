export interface User {
  Id: string;
  FirstName: string;
  LastName: string;
  Password: string;
  PhoneNumber: string;
  Year: string;
  StudentId: string;
  Email: string;
  Collage?: string | null;
  Department?: string | null;
  Program?: string | null;
  ProfilePicture?: string | null;
  ResetToken?: string | null;
  ResetTokenExpires?: Date | null;
  Roles?: { name: string }[] | null;
  CreatedAt: Date;
  FailedLoginAttempts: number;
  IsLocked: boolean;
  LockUntil?: Date | null;
  IsBlocked: boolean;
  deletedAt?: Date | null;
  PasswordResetToken?: string | null;
  PasswordResetExpires?: Date | null;
}
