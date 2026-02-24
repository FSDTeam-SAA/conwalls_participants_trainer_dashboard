"use client";
import {
  LogOut,
} from "lucide-react";



import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";

import sidebarImg from "../../../../public/assets/images/sidebar-logo.png"


const items = [
  {
    title: "Insight Engine",
    url: "/participants",
    // icon: "../../../../public/assets/images/sidebar-logo.png",
  },

];

export function DashboardSidebar() {
  // const pathName = usePathname();

  return (
    <Sidebar className="h-screen border-none w-[320px] mt-[106px]">
      <SidebarContent className="bg-primary scrollbar-hide ">
        <SidebarGroup className="p-0">
          <div className=" flex flex-col justify-between h-fit pb-5">
            <div>
              <SidebarGroupContent className="px-6 pt-12">
                <SidebarMenu>
                  {items.map((item) => {
                    // const isActive =
                    //   item.url === "/participants"
                    //     ? pathName === "/participants"
                    //     : pathName === item.url ||
                    //       pathName.startsWith(`${item.url}/participants`);

                    return (
                      <SidebarMenuItem key={item.title}>
                        {/* <SidebarMenuButton
                          className={`h-[56px] rounded-[8px] text-xl text-white font-semibold transition-all duration-300 ${
                            isActive &&
                            "bg-[#f8f9fa] hover:bg-[#f8f9fa] text-primary shadow-[0px_4px_6px_0px_#DF10201A] hover:text-primary hover:shadow-[0px_4px_6px_0px_#DF10201A] font-medium"
                          }`}
                          asChild
                        > */}
                         <SidebarMenuButton
                          className={`bg-[#00253E] hover:bg-[#000f18] h-[56px] p-4 rounded-[8px] text-xl text-white hover:text-white font-semibold transition-all duration-300`}
                          asChild
                        >
                          <Link href={item.url}>
                            {/* <item.icon /> */}
                            <Image src={sidebarImg} alt="Sidebar Logo" width={24} height={24} />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>

            <div className=" ">
              <SidebarFooter className="border-t border-gray-300">
                <button onClick={()=>signOut({callbackUrl:"/login"})} className="font-medium text-[#FF0000] flex items-center gap-2 pl-5 mt-20">
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
