import { dummyPayslipData } from "../assets/assets";
import Loading from "../components/Loading";
import { useCallback, useContext, useEffect, useState } from "react";
import { dummyEmployeeData } from "../assets/assets";
import PayslipList from "../components/Payslip/PayslipList";
import GeneratePayslipForm from "../components/Payslip/GeneratePayslipForm";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const {user} = useAuth();
  const isAdmin = user?.role === "ADMIN"; // Replace with actual role check
 
  const fetchPayslips = useCallback(async () => {
    try{
     const res = await api.get("/payslips");
     console.log("Fetched payslips", res.data);
     setPayslips(res.data.data || res.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || error?.message || "Failed to fetch payslips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {  
    fetchPayslips();
  }, [fetchPayslips]);

  useEffect(() => {  
     if(isAdmin) api.get("/employees").then((res) => 
      setEmployees(res.data?.filter((e) => !e.isDeleted))).catch(error => {
        toast.error(error.response?.data?.error || error?.message || "Failed to fetch employees");  
      }); 
  }, [isAdmin]);

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">{isAdmin ? "Generate and manage employee payslips" : "Your Payslip History"}</p>
        </div>

        {isAdmin && (
         <GeneratePayslipForm employees={employees} onSuccess={fetchPayslips}/>
        )}
      </div>  
      <PayslipList payslips={payslips} employees={employees} isAdmin={isAdmin}/>
    </div>
  )
}

export default Payslips