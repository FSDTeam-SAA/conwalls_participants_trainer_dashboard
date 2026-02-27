"use client";
import { LogOut, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const items = [
  {
    title: "Participants Management",
    url: "/trainer/participants",
    icon: Users,
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
];

export function DashboardSidebar() {
  const pathName = usePathname();

  return (
    <Sidebar className="border-none w-[300px]">
      <SidebarContent className="bg-primary scrollbar-hide">
        <SidebarGroup className="p-0">
          <div className="flex flex-col justify-between min-h-screen pb-5">
            <div>
              <SidebarGroupLabel className="mt-5 mb-5 h-[80px] flex justify-center">
                <Link href={`/`}>
                  <Image
                    src={`/assets/images/logo.jpg`}
                    alt="logo"
                    width={1000}
                    height={1000}
                    className="h-[60px] w-auto object-contain"
                  />
                </Link>
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-4 pt-5">
                <SidebarMenu>
                  {items.map((item) => {
                    const isActive =
                      item.url === "/"
                        ? pathName === "/"
                        : pathName === item.url ||
                          pathName.startsWith(`${item.url}/`);

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`
      h-[58px] rounded-[8px] px-4
      transition-all duration-300
      ${
        isActive
          ? "bg-[#00253E] text-white"
          : "text-[#FF3333] hover:bg-[#00253E] hover:text-white"
      }
    `}
                        >
                          <Link
                            href={item.url}
                            className="flex items-center gap-3 group"
                          >
                            <item.icon
                              className={`
          !w-6 !h-6 transition-colors duration-300
          ${isActive ? "text-white" : "text-[#FF3333] group-hover:text-white"}
        `}
                            />
                            <span className="text-base font-semibold leading-[110%]">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>

            <div>
              <SidebarFooter className="border-t border-gray-300">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="font-medium text-red-500 flex items-center gap-2 pl-2 mt-5"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </SidebarFooter>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
