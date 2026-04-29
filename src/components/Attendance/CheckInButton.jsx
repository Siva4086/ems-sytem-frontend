import { Loader2Icon, LogInIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";


const CheckInButton = ({todayRecord , onAction}) => {

    const [loading, setLoading] = useState(false);
    
    const handleAttendance = async () => {
        setLoading(true);
        try{
            await api.post("/attendance");
            onAction();
        }catch(error){
           toast.error(error.response?.data?.error || error?.message || "Failed to update attendance");
        }finally{
            setLoading(false);
            onAction();
        }
    }

    if(todayRecord?.checkOut) {
        return (
           <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200">
             <h3 className="text-lg font-bold text-slate-900">Work Day Completed</h3>
             <p className="text-slate-500 text-sm mt-1">Great job!, See you tomorrow</p>
           </div>
            )
   };

   const isCheckedIn = !!todayRecord?.checkIn;

  return (
    <div className="absolute bottom-4 right-4 flex flex-col z-1">
        <button className={`${isCheckedIn ? "from-slate-700 to-slate-900" : "from-indigo-700 to-indigo-600 "} w-full max-w-xs flex justify-between items-center gap-8 p-4 rounded-xl bg-linear-to-br text-white`} onClick={handleAttendance} disabled={loading}>
            {loading ? (
              <Loader2Icon className="animate-spin size-7"/>
            ): isCheckedIn ? (
                <LogOutIcon className="size-7"/>
            ) : (
                <LogInIcon className="size-7"/>
            )}
            <div className="relative flex flex-col items-center text-center">
                <h2 className="text-lg font-medium mb-1 ">{loading ? "Processing..." : isCheckedIn ? "Check Out" : "Check In"} </h2>
                <p className="text-xs opacity-80">{ isCheckedIn ? "Click to end your shift":"start your work day"}</p>
            </div>
        </button>
    
    </div>
  )
}

export default CheckInButton