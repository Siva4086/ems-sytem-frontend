import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { dummyProfileData } from "../assets/assets";
import { MenuIcon, XIcon,UserIcon, LayoutGridIcon, CalendarIcon, FileTextIcon, DollarSignIcon, SettingsIcon, ChevronRightIcon, LogOutIcon, Loader2} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Sidebar = () => {
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);  
  const { logout,user,loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {      
    api.get("/profile")
      .then((response) => {
        const { firstName, lastName } = response.data;
        setUserName(`${firstName} ${lastName}`);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  },[]);

  useEffect(() => {      
    setMobileOpen(false);
  },[location]);

  const role = user?.role || "EMPLOYEE";

  const navItems = [
    { name: "Dashboard", to: "/dashboard" , icon :LayoutGridIcon },

    role === "ADMIN" ? 
    { name: "Employees", to: "/employees", icon :UserIcon} : 
    { name: "Attendance", to: "/attendance", icon: CalendarIcon }, 

    { name: "Leave", to: "/leave", icon : FileTextIcon },
    { name: "Payslips", to: "/payslips", icon : DollarSignIcon},
    { name: "Settings", to: "/settings", icon : SettingsIcon },
  ]

  const handleLogout = () => {
      logout();              // ✅ clear state + token
      navigate("/login");    // ✅ redirect properly
  }

  const sidebarContent = (
    <>
    { /* Brand Header */ }
    <div className="px-5 pt-6 pb-5 border-b border-white/6">
     <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <UserIcon className="text-white size-7"/>
         <div>
          <p className="font-semibold text-[13px] text-white tracking-tight">Employee MS</p>
          <p className="text-[11px] text-slate-500 font-medium">Management System</p>
        </div>
        </div>

         { /* Close Button on Mobile */ }
         <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white p-1 lg:hidden" >
            <XIcon size={20} />
         </button>
     </div>
    </div>

     { /* User Profile Card */ }
    {userName && (
     <div className="mx-3 mt-4 p-3 mb-1 rounded-lg border border-white/4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-white ring-1 ring-white/10 shrink-10">
        <span className="text-xs font-semibold text-slate-400">{userName?.charAt(0).toUpperCase()}</span>
        </div>
        <div className="min-w-0">
            <p className="text-[13px] font-medium text-slate-200 truncate">{userName}</p> 
            <p className="text-[11px] text-slate-500 truncate">{role === "ADMIN" ? "Administrator" :  "Employee" }</p>
        </div>
      </div>
     </div>
    )} 
    { /* Section Label */ }
    <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em]">Navigation</p>
    </div>


    { /* Navigation Links */ }
    <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
      {loading ?(
        <div className="px-3 py-3 flex items-center gap-2 text-slate-500">
         <Loader2 className="animate-spin w-4 h-4"/>
         <span className="text-sm text-slate-500 ml-2">Loading...</span>
        </div>
      ):(
        navItems.map((item) => { 
            const isActive = location.pathname.startsWith(item.to);
            return (
                <Link key = {item.name} to={item.to} className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-all duration-150 relative ${isActive ? "bg-indigo-500/12  text-indigo-300" : "text-slate-300 hover:bg-white/4 hover:text-white"}`}>
                   { isActive && <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 bg-indigo-500 rounded-r-full"/>}
                    <item.icon className={`w-[17px] h-[17px] shrink-0 ${isActive ? "text-indigo-300" : "text-slate-400 group-hover:text-slate-300"}`}/>
                    <span className="flex-1">{item.name}</span>
                    { isActive && <ChevronRightIcon className="w-3.5 h-3.5 text-indigo-500/50"/>} 
                </Link>
            ); 
        })
      )}

    </div>

     { /* Logout */ }
     <div className="p-3 border-t border-white/6">
     <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150 cursor-pointer">
        <LogOutIcon className="w-[17px] h-[17px]"/>
         <span>Logout</span>
     </button>
     </div>
    </>
  )

  return (
    <>
    { /* Mobile humburger button */ }
    <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900 text-white shadow-lg border border-white/10 ">
        <MenuIcon size={20} className="text-slate-700"/>
    </button>

    { /* Mobile Overlay */ }
    {mobileOpen && ( 
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)}/>
    )} 

    { /* Sidebar - Desktop */ }
    <aside className="hidden lg:flex flex-col h-full w-[260px] bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4">
        {sidebarContent}
    </aside>

    { /* Sidebar - Mobile */ }
    <aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
        {sidebarContent}
    </aside>

    </>
  )
}

export default Sidebar