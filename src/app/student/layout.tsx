import type { ReactNode } from "react";
import { AppShell, type MenuBundle } from "@/components/student-shell";

const MY_MENUS: MenuBundle = {
  navMain: [
    { title: "Home", url: "/student", icon: "home" },
    // { title: "Jadwal", url: "/pelajaran", icon: "calendar" },
    { title: "LMS", url: "/student/lms", icon: "folders" },
    { title: "Tryout", url: "/student/tryout", icon: "trophy" },
  ],
  navSecondary: [{ title: "Profil", url: "/student/profile", icon: "user" }],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      title="Pelajaran"
      menus={MY_MENUS}
      fallbackRedirect="/cms/dashboard"
      enforceRole
    >
      {children}
    </AppShell>
  );
}