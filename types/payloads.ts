import { JWTPayload } from "jose";

interface UserPayload extends JWTPayload {
  Id: string;
  FirstName: string;
  LastName: string;
  StudentId: string;
  Password: string;
  CreatedAt: Date;
  FailedLoginAttempts: number;
  IsLocked: boolean;
  LockUntil: Date | null;
  Email: string;
  Year: string;
  admin?: boolean; // Include admin field
}

export type { UserPayload };

