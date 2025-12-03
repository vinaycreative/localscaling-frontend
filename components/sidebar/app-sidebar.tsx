import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Role, type RoleValue } from "@/constants/auth";
import { parseJwtPayload } from "@/lib/auth/parse";
import { MessageCircle } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import * as React from "react";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

const data = {
  user: {
    name: "User Name",
    email: "user@email.com",
  },

  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: MessageCircle,
    },
  ],
};

export default async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const jar = await cookies();
  const token = jar.get("access_token")?.value;
  const decoded = token ? parseJwtPayload(token) : null;
  const rawRole = decoded?.role;
  const role =
    rawRole === "authenticated" || !rawRole
      ? Role.CLIENT
      : (rawRole as RoleValue);
  const name = decoded?.name ?? "User";
  const email = decoded?.email ?? "";
  return (
    <Sidebar {...props} variant="floating" className="bg-muted">
      <SidebarHeader className="h-16 bg-background rounded-t-md ">
        <div className="flex h-full w-full items-center justify-start px-2">
          <Image
            width={100}
            height={50}
            src="/logo.svg"
            alt="Logo"
            className="w-40"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavMain initialRole={role} />
      </SidebarContent>
      <SidebarFooter className="bg-background rounded-b-md">
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <NavUser user={{ name, email }} />
      </SidebarFooter>
    </Sidebar>
  );
}
