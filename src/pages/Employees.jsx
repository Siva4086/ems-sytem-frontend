import { useCallback, useEffect, useState } from "react"
import { dummyEmployeeData } from "../assets/assets";
import { Plus, Search, X } from "lucide-react";
import { DEPARTMENTS } from "../assets/assets";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";
import api from "../api/axios";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [search, setSearch] = useState("");
    const [selectedDept,setSelectedDept] = useState("");
    const [editEmployee, setEditEmployee] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const fetchEmployees = useCallback(async () => {  
      try{
         const url = selectedDept ? `/employees?department=${selectedDept}` : "/employees";
         const response = await api.get(url);
         setEmployees(response.data);
      }catch(err){
        console.error("Error fetching employees:", err);
      } finally{ 
        setLoading(false);
      } 
    },[selectedDept]);

    useEffect(() => {
        fetchEmployees(); 
    }, [selectedDept,fetchEmployees]);

    const filtered = employees.filter((emp) => {
      const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.position}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDepartment = selectedDept ? emp.department === selectedDept : true;
      return matchesSearch && matchesDepartment;
    });


  return (
    <div className="animate-fade-in">
       {/* Header */}
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"> 
         <div>
            <h1 className="page-title">Employees</h1>
            <p className="page-subtitle">Manage your team members</p>
         </div>

         <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus size={16}/> Add Employee
         </button>
       </div>
 
       {/* Search bar */}
       <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
         <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transform w-4 h-4"/>
           <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10!"
           />
        </div>
        <select className="max-w-40" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => ( 
                <option key={dept} value={dept}>{dept}</option>
            ))}
        </select>
       </div>

       {/* Employee cards */}
       {loading ? (
        <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-indigo-600 rounded-full"/>
        </div>
       ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        { filtered.length === 0 ? (
          <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200"> No Employees Found </p>
        ) : (
          filtered.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onDelete={() => fetchEmployees()}
              onEdit={setEditEmployee}
            />
          ))
        )}
        </div>
       )}

       {/* Create Employee Modal */}
       {showCreateModal && (
        <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center overflow-y-auto" onClick={() => setShowCreateModal(false)}>
        <div className="fixed inset-0"/>
        <div className="bg-white rounded-2xl shadow-2xl  w-full max-w-3xl animate-fade-in my-8 relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
                <div>
                <h2 className="text-lg font-semibold text-slate-900">Add New Employee</h2>
                <p className="text-sm text-slate-500 mt-0.5">Create a user account and employee profile  </p>
                </div>

                <button onClick={()=> setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 ">
                  <X className="w-5 h-5"/>
                </button>
            </div>
            <div className="p-6">
               <EmployeeForm onSuccess={()=>{
                  setShowCreateModal(false);
                  fetchEmployees();
               }} onCancel={() => setShowCreateModal(false)} />
            </div>
        </div>
       </div>
    )}

       {/* Edit Employee Modal */}
        { editEmployee && (
        <div className="fixed p-4 bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center overflow-y-auto" onClick={()=> setEditEmployee(null)}>
        <div className="bg-white rounded-2xl shadow-2xl  w-full max-w-3xl animate-fade-in my-8 relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
                <div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Employee</h2>
                <p className="text-sm text-slate-500 mt-0.5">Update employee details</p>
                </div>

                <button onClick={()=> setEditEmployee(null)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 ">
                  <X className="w-5 h-5"/>
                </button>
            </div>

            <div className="p-6"> 
              <EmployeeForm key={editEmployee?.id || editEmployee?._id} initialData={editEmployee} onSuccess={()=>{
                  setEditEmployee(null);
                  fetchEmployees();
               }} onCancel={() => setEditEmployee(null)} />
            </div>
        </div>
       </div> 
        )}

       <div>
     </div>
    </div>
  )
}

export default Employees