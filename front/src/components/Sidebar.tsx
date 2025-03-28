"use client"

import { CaretLeft, CaretRight, DotsThreeVertical, MetaLogo, UserCircle } from "@phosphor-icons/react"
import { jwtDecode } from "jwt-decode"
import { createContext, type ReactNode, useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CustomJwtPayload } from "../types"

type SidebarContextType = {
  expanded: boolean
}

const sidebarContext = createContext<SidebarContextType>({ expanded: true })

type SidebarProps = {
  children: ReactNode
}


export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true)
  const navigate = useNavigate()
  const [decoded, setDecoded] = useState<CustomJwtPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('AUTH_TOKEN')

    if (!token) {
      navigate('/auth/login')
    } else {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token)
        setDecoded(decodedToken)
      } catch (error) {
        console.error('Token inválido: ', error)
        localStorage.removeItem('AUTH_TOKEN')
        navigate('/auth/login')
      }
    }
  }, [navigate])
  if (!decoded) {
    return null
  }
  return (
    <>
      <aside className="sticky top-0 h-screen overflow-hidden">
        <nav className="h-full flex flex-col bg-white border-r border-gray-200 shadow-md">
          <div className="p-4 pb-2 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <MetaLogo
                className={`overflow-hidden transition-all`}
                size={expanded ? 32 : 0}
                weight="bold"
                color="#0032ff"
              />
              <span className={`text-xl font-semibold ${expanded ? "block" : "hidden"}`}>Dashboard</span>
            </div>

            <button
              onClick={() => setExpanded((current) => !current)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
            >
              {expanded ? <CaretRight /> : <CaretLeft />}
            </button>
          </div>

          <sidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </sidebarContext.Provider>

          <div className="border-t border-gray-200 items-center flex p-3 justify-center">
            <UserCircle size={30} color="#7a7a7a" weight="thin" />

            <div
              className={`flex justify-between items-center overflow-hidden transition-all 
                ${expanded ? "w-52 ml-3" : "w-0"}`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{decoded.name}</h4>
                <span className="text-xs text-gray-600">{decoded.email}</span>
              </div>
              <DotsThreeVertical weight="bold" className="hover:bg-gray-50 rounded-full w-8 h-8 p-1 cursor-pointer" />
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}

type SideBarIconProps = {
  icon: ReactNode
  text: string
  active: boolean
  alert: any
  link: string
}

export function SidebarItem({ icon, text, active, alert, link }: SideBarIconProps) {
  const { expanded } = useContext(sidebarContext)
  return (
    <Link to={link}>
      <li
        className={`
        relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
        ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}
        `}
      >
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
        {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}></div>}

        {!expanded && (
          <div
            className={`
            absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            `}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  )
}

