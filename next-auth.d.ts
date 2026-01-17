import { Student } from "@/types/student";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      token: string;
      roles: {
        id: number;
        name: string;
      }[];
      student: Student;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    token: string;
    roles: {
      id: number;
      name: string;
    }[];
    student: Student;
  }
}