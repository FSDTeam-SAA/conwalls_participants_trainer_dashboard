'use client'
import { LogOut, Users } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Image from 'next/image'
import Link from 'next/link'
// import { usePathname } from 'next/navigation'
import sidebarImg from "../../../../public/assets/images/t_sidebar_icon.png";
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import LogoutModal from '@/components/modals/logout-modal'
import { toast } from 'sonner'

const items = [
  {
    title: 'Participants Management',
    url: '/trainer/participants',
    icon: Users,
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
]

export function DashboardSidebar() {
  // const pathName = usePathname()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const handleLogout = async () => {
    try {
      toast.success('Logout successful!')
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed. Please try again.')
    }
  }

  return (
    <>
      <Sidebar className="h-screen border-none w-[335px] pt-[106px]">
        <SidebarContent className="bg-primary scrollbar-hide flex flex-col">
          <SidebarGroup className="p-0 flex-1">
            {/* <SidebarGroupLabel className="mt-5 mb-5 h-[80px] flex justify-center">
              <Link href={`/`}>
                <Image
                  src={`/assets/images/logo.jpg`}
                  alt="logo"
                  width={100}
                  height={100}
                  className="h-[60px] w-auto object-contain"
                />
              </Link>
            </SidebarGroupLabel> */}
            <SidebarGroupContent className="px-4 pt-12">
              <SidebarMenu>
                {items.map(item => {
                  // const isActive =
                  //   item.url === '/'
                  //     ? pathName === '/'
                  //     : pathName === item.url ||
                  //       pathName.startsWith(`${item.url}/`)

                  return (
                    <SidebarMenuItem key={item.title}>
                      {/* <SidebarMenuButton
                        className={`h-[60px] rounded-none text-[20px] text-primary hover:bg-[#f8f9fa] hover:text-primary transition-all duration-300 active:scale-95 hover:scale-[1.02] ${
                          isActive &&
                          'bg-[#f8f9fa] hover:bg-[#f8f9fa] text-primary shadow-[0px_4px_6px_0px_#DF10201A] hover:text-primary hover:shadow-[0px_4px_6px_0px_#DF10201A] font-medium'
                        }`}
                        asChild
                      >
                        <Link href={item.url}>
                          <item.icon className="w-6 h-6" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton> */}

                      <SidebarMenuButton
                            className={`bg-[#00253E] hover:bg-[#000f18] h-[56px] p-4 rounded-[8px] text-xl text-white hover:text-white font-semibold transition-all duration-300`}
                            asChild
                          >
                            <Link href={item.url}>
                              {/* <item.icon /> */}
                              <Image
                                src={sidebarImg}
                                alt="Sidebar Logo"
                                width={24}
                                height={24}
                              />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-primary p-4">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-[8px] text-[17px] font-semibold text-[#FF4D4D] hover:bg-black/5 transition-all duration-200 w-full"
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
            Log out
          </button>
        </SidebarFooter>
      </Sidebar>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  )
}
