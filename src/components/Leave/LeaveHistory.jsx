import { getWorkingHoursDisplay } from "../../assets/assets"
import {format} from 'date-fns';
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
    const [processing, setProcessing] = useState(null);

    const handleStatusUpdate = async (id, status) => {
        setProcessing(id);
        try{
            await api.patch(`/leave/${id}/status`, { status });
            
            toast.success(`Leave ${status.toLowerCase()} successfully!`);
            onUpdate && onUpdate();
        } catch(err) {
            console.error("Error updating leave status:", err);
            toast.error(err.response?.data?.error || err?.message || "Failed to update leave status. Please try again.");
        } finally {
            setProcessing(null);
        }
    };


  return (
    <div className="card overflow-hidden">
        <div className="overflow-x-auto">
            <table className="table-modern">
                <thead className="bg-slate-50"> 
                    <tr>
                        {isAdmin && <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>}
                        <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        {isAdmin && <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>}
                  </tr>   
                </thead>    
                <tbody> 
        {leaves?.length === 0 ? (
          <tr>
            <td className="text-center py-12 text-slate-400" colSpan={isAdmin ? 6 : 4}> No records found </td>
          </tr>
        ) : (       
                leaves?.map((leave) => {
                    return (         
                        <tr key={leave.id || leave._id}>  
                            {isAdmin && (
                            <td className="text-slate-900">{leave.employee?.firstName} {leave.employee?.lastName}</td>    
                            )}
                            <td><span className="badge bg-slate-100 text-slate-600">{leave.type}</span></td>
                            <td className="text-xs text-slate-500">{ leave.startDate ? format(new Date(leave.startDate), 'MMM dd') : "-" } - { leave.endDate ? format(new Date(leave.endDate), 'MMM dd, yyyy') : "-" }</td>
                            <td className="max-w-xs truncate text-slate-500" title={leave.reason}>{leave.reason}</td>
                            <td><span className={`badge ${leave.status === "APPROVED" ? "badge-success" : leave.status === "REJECTED" ? "badge-danger" : "badge-warning"}`}>{leave.status || "N/A"}</span></td>
                            {isAdmin && (
                                <td>
                                    {leave.status === "PENDING" && (
                                        <div className="flex items-center justify-center gap-2">
                                            <button disabled={!!processing} onClick={() => handleStatusUpdate(leave.id || leave._id, "APPROVED")} className="p-1.5 rounded-md  bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                                               {processing === (leave.id || leave._id) ? <Loader2 className="w-4 h-4 animate-spin" /> :<Check className="w-4 h-4"/>} 
                                              </button>
                                              <button disabled={!!processing} onClick={() => handleStatusUpdate(leave.id || leave._id, "REJECTED")} className="p-1.5 rounded-md  bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                                               {processing === (leave.id || leave._id) ? <Loader2 className="w-4 h-4 animate-spin" /> :<X className="w-4 h-4"/>} 
                                              </button>      
                                        </div>
                                    )}             
                                </td>

                            )}
                        </tr>
                    )
                    })
            )} 
        </tbody>    
      </table>      
    </div>  
    </div>
  )
}

export default LeaveHistory