import { CalendarIcon , FileTextIcon , DollarSignIcon, ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

const EmployeeDashboard = ({data}) => {
    const emp = data.employee;

    const cards = [
         {
            icon : CalendarIcon ,
            title: "Days Present",
            value: data.currentMonthAttendance,
            subtitle : "This month"
         },
         {
            icon : FileTextIcon,
            title: "Pending Leaves",
            value: data.pendingLeaves,
            subtitle : "Awaiting approval"
         }, 
         {
            icon : DollarSignIcon,
            title: "Latest Payslip",
            value: data.latestPayslip  ? `$${data.latestPayslip.netSalary.toLocaleString()}` : "N/A",
            subtitle : "Most recent payout"
         }
    ]
  return (
    <div className="animate-fade-in">
        <div className="page-header">
            <h1 className="page-title">Welcome, {emp?.firstName}!</h1>
            <p className="page-subtitle">{emp?.position} - {emp?.department || "No Department"}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="card card-hover p-5 sm:p-6 relative overflow-hidden group flex items-center justify-between">
                    <div>
                        <div className="absolute left-0 top-0 w-1 h-full rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70 transition-colors duration-200"/>
                         <p className="text-sm font-medium text-slate-700">{card.title}</p>
                         <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                    </div>
                    <card.icon className="size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-200"/>
                </div>
            ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/attendance" className="btn-primary inline-flex items-center justify-center text-center gap-2">
            Mark Attendance <ArrowRightIcon className="w-4 h-4"/>
            </Link>
            <Link to="/leave" className="btn-secondary text-center">
            Apply For Leave
            </Link>
        </div>
    </div>
  )
}

export default EmployeeDashboard