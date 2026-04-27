import { DefaultSession } from "next-auth";

type AppUserRole = "CUSTOMER" | "ADMIN";

declare module "next-auth" {
  interface User {
    role?: AppUserRole;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AppUserRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppUserRole;
  }
}
