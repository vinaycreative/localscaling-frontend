import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { cookies } from "next/headers";
import { parseJwtPayload } from "@/lib/auth/parse";
import { Role, type RoleValue } from "@/constants/auth";

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

export default async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const jar = await cookies();
  const token = jar.get("access_token")?.value;
  const decoded = token ? parseJwtPayload(token) : null;
  const role = (decoded?.role as RoleValue | undefined) ?? undefined;
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
