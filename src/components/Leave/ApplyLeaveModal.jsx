import { useState } from "react";
import { X , FileText, CalendarDays, Send, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const ApplyLeaveModal = ({ open, onClose, onSuccess }) => {
     
    const [loading, setLoading] = useState(false) ;
    const today = new Date() ;
    const tomorrow = new Date(today) ;
    tomorrow.setDate(today.getDate() + 1) ;
    const minDate = tomorrow.toISOString().split("T")[0] ;

    const handleSubmit = async (e) => {
        e.preventDefault() ;
        setLoading(true) ;
        const formData = new FormData(e.target) ;
        const data = Object.fromEntries(formData.entries()) ;
        console.log("Form data:", data) ;
        try{
           await api.post("/leave",data) ;
           onSuccess && onSuccess() ;
           toast.success("Leave request submitted successfully!") ;
           onClose() ;
        }catch(err){
          console.error("Error submitting leave request:", err) ;
          toast.error(err.response?.data?.error || err?.message || "Failed to submit leave request. Please try again.") ;
        } finally{    
          setLoading(false) ;
        };
    }

    if(!open) return null ;


  return (
      <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl  w-full max-w-lg animate-fade-in relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
                <div>
                <h2 className="text-lg font-semibold text-slate-800">Apply for Leave</h2>
                <p className="text-sm text-slate-500 mt-0.5">Submit your leave request for approval</p>
                </div>

                <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 ">
                  <X className="w-5 h-5"/>
                </button>
            </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5 ">
                    <div>
                        <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
                            <FileText className="w-4 h-4 text-slate-400"/>
                            Leave Type
                        </label>
                        <select name="type" required >
                            <option value="SICK">Sick Leave</option>
                            <option value="CASUAL">Casual Leave</option>
                            <option value="ANNUAL">Annual Leave</option>
                        </select>
                    </div> 

                    <div>
                        <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
                            <CalendarDays className="w-4 h-4 text-slate-400"/>
                            Duration
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <span className="block text-xs text-slate-400 mb-1">From</span>
                            <input type="date" name="startDate" min={minDate} required />
                            </div>
                             <div>
                             <span className="block text-xs text-slate-400 mb-1">To</span>
                             <input type="date" name="endDate" min={minDate} required />
                            </div>
                        </div>
                    </div> 

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Reason
                        </label>
                        <textarea name="reason" required rows={3}  className="resize-none" placeholder="Briefly describe why you need this leave...">

                        </textarea>
                    </div> 


                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} type="button" className="btn-secondary flex-1">Cancel</button> 

                        <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            {loading  ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>


                    
                    </form> 
        </div>
       </div>
  )
}

export default ApplyLeaveModal