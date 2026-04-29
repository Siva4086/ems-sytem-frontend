import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import { Loader2Icon } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const EmployeeForm = ({initialData , onSuccess , onCancel}) => {
  const navigate = useNavigate() ;
  const [loading , setLoading] = useState(false) ;  

  const isEditMode = !!initialData ;

  const handleSubmit = async (e) => {
    e.preventDefault() ;
    setLoading(true) ;
    const formData = new FormData(e.target) ;
    if(isEditMode){
        const pwd = formData.get("password") ;
        if(!pwd) formData.delete("password") ;
    }
    try{
      const url = isEditMode ? `/employees/${initialData.id}` : "/employees" ;
      const method = isEditMode ? "put" : "post" ;
       await api[method](url,formData) ;
       onSuccess && onSuccess() ;
       navigate("/employees") ;
    }catch(err){
      console.error("Error submitting form:", err) ;
      toast.error(err.response?.data?.error || err?.message || "Failed to save employee. Please try again.") ;
    } finally{    
      setLoading(false) ;
    } ;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 animate-fade-in">
      {/* <h2 className="text-2xl font-bold mb-4">{isEditMode ? "Edit Employee" : "Add New Employee"}</h2> */}
      {/* Form fields for employee details */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
          <label className="block mb-2">First Name</label>
          <input 
          type = "text"     
          name = "firstName"
          defaultValue={initialData?.firstName || ""}
          required
          />
          </div>

          <div>
          <label className="block mb-2">Last Name</label>
          <input 
          type = "text"     
          name = "lastName"
          defaultValue={initialData?.lastName || ""}
          required
          />
          </div>

          <div>
          <label className="block mb-2">Phone Number</label>
          <input     
          name = "phone"
          defaultValue={initialData?.phone || ""}
          required
          />
          </div>

          <div>
          <label className="block mb-2">Join Date</label>
          <input     
          type="date"
          name = "joinDate"
          defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split("T")[0] : ""}
          required
          />
          </div>

          <div className="sm:col-span-2">
          <label className="block mb-2">Bio (Optional) </label>
          <textarea     
          name = "bio"
          defaultValue={initialData?.bio || ""}
          rows={3}
          className="resize-none"
          placeholder="Brief description..."
          />
          </div>
        </div>
      </div>

      {/* Employment Details */} 

      <div className="card p-5 sm:p-6">
        <h3 className="text-base text-slate-900 font-medium mb-6 pb-4 border-b border-slate-100">Employment Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">

          <div>
          <label className="block mb-2">Department</label>
          <select name="department" defaultValue={initialData?.department || ""} required>
            <option value="" disabled>Select Department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          </div>

          <div>
          <label className="block mb-2">Position</label>
          <input     
          name = "position"
          defaultValue={initialData?.position || ""}
          required
          />
          </div>

          
          <div>
          <label className="block mb-2">Basic Salary</label>
          <input  
          type="number"   
          name = "basicSalary"
          min = {0}
          step = "0.01"
          defaultValue={initialData?.basicSalary || 0}
          required
          />
          </div>

          <div>
          <label className="block mb-2">Allowances</label>
          <input  
          type="number"   
          name = "allowances"
          min = {0}
          step = "0.01"
          defaultValue={initialData?.allowances || 0}
          required
          />
          </div>

          <div>
          <label className="block mb-2">Deductions</label>
          <input  
          type="number"   
          name = "deductions"
          min = {0}
          step = "0.01"
          defaultValue={initialData?.deductions || 0}
          required
          />
          </div>

          {isEditMode && (
          <div>
          <label className="block mb-2">Status</label>
          <select 
          name = "employmentStatus"
          defaultValue={initialData?.employmentStatus}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            </select>
          </div>
 
          )}

          </div>
          </div>


      {/* Account Setup */}

        <div className="card p-5 sm:p-6">
        <h3 className="text-base text-slate-900 font-medium mb-6 pb-4 border-b border-slate-100">Account Setup</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div className="sm:col-span-2"> 
          <label className="block mb-2">Work Email</label>
          <input 
          type = "email"     
          name = "email"
          defaultValue={initialData?.email || ""}
          required
          />
          </div>
           
           {!isEditMode && (
             <div>
             <label className="block mb-2">Temporary Password</label>
             <input 
               type = "password"     
               name =  "password"
               required
               />
              </div>
            )}

            {isEditMode && (
             <div>
             <label className="block mb-2">Change Password (Optional) </label>
             <input 
               type = "password"     
               name =  "password"
               placeholder="Leave blank to keep current password"
               />
              </div>
            )}

             <div>
             <label className="block mb-2">System Role </label>
             <select  
               name =  "role"
               defaultValue={initialData?.user?.role || "EMPLOYEE"}
               >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option> 
               </select>
              </div>

        </div>
      </div>


      {/* Buttons */} 
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">  
        <button type="button" onClick={onCancel ? onCancel : () => navigate(-1)} className="btn-secondary">
          Cancel
        </button> 
        <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center">

          {loading && <Loader2Icon className="animate-spin w-4 h-4 mr-2"/>} 
          {isEditMode ? "Update Employee" : "Create Employee"}
        </button>
      </div>
    </form> 
  )
}

export default EmployeeForm