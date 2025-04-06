import user, { Role } from "@prisma/client";
type HeroProps = {
  user?: {
    id: string;
    FirstName: string;
    LastName: string;
    email: string;
    password: string;
    createdAt: Date;
    failedLoginAttempts: number;
    isLocked: boolean;
    lockUntil: Date | null;
    roles: Role[];
    studentId: string;
  } | null;
};

const Hero = ({ user }: HeroProps) => {
  return (
    <div>
      <h1>Welcome, {user?.FirstName}!</h1>
      <p>Your email is: {user?.email}</p>
    </div>
  );
};

export default Hero;