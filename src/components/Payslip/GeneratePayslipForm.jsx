import React, {useState} from 'react'
import { Loader2, Plus, X } from "lucide-react";
import api from '../../api/axios';
import toast from 'react-hot-toast';

const GeneratePayslipForm = ({employees,onSuccess}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    if(!isOpen) return (
        <button onClick={() => setIsOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4 mr-2"/> Generate Payslip
        </button> 
    )

    const handleSubmit = async (e) => {
        e.preventDefault() ;
        setLoading(true) ;
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        try{
            await api.post("/payslips", data);
            setIsOpen(false);
            onSuccess();
        }catch(error){
            console.error(error);
            toast.error(error.response?.data?.error || error?.message || "Failed to generate payslip");
        }finally{
            setLoading(false);
  
        }
    }

  return (
    <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
        <div className='card max-w-lg w-full p-6 animate-slide-up' onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
                <h3 className='text-lg font-bold text-slate-900'>Generate Monthly  Payslip</h3>
                <button className='text-slate-400 hover:text-slate-600 p-1' onClick={() => setIsOpen(false)}>
                    <X size={20}/>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Select Employee */}
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'> Employee</label>
                    <select name="employeeId" required className='w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'>
                        <option value="">-- Select Employee --</option>
                        {employees.map(emp => (
                            <option key={emp.id || emp._id} value={emp.id || emp._id}>{emp.firstName} {emp.lastName} ({emp.position})</option>
                        ))}
                    </select>
                </div>  

                {/* Select Month and Year */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'> Month</label>
                    <select name="month" required className='w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'>
                        <option value="">-- Select Month --</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                    </select>
                    </div>

                {/* Select Year */}
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'> Year</label>
                    <input type="number" name="year" required min={2000} max={new Date().getFullYear()}  defaultValue={new Date().getFullYear()}  className='w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500' placeholder='e.g. 2024'/>
                </div>  
                </div>

               {/* Basic Salary */}
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'> Basic Salary</label>
                    <input type="number" name="basicSalary" required min={0} className='w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500' placeholder='e.g. 50000'/>
                </div> 

                {/* Allowances and Deductions */}
                <div className='grid grid-cols-2 gap-4'>
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'> Allowances</label>
                    <input type="number" name="allowances"  min={0} defaultValue={0} className='w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500' placeholder='e.g. 5000'/>
                </div> 
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'> Deductions</label>
                    <input type="number" name="deductions"  min={0} defaultValue={0} className='w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500' placeholder='e.g. 2000'/>
                </div> 

                </div>

               {/* Butttons */}
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setIsOpen(false)} className='btn-secondary'> Cancel</button>
                    <button type="submit" disabled={loading} className='btn-primary flex items-center'>
                        {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin'/>}
                       Generate
                    </button>
                </div>
                </form>
            </div>
        </div>
  )
}

export default GeneratePayslipForm