import { useEffect, useState } from "react";
import { dummyEmployeeDashboardData } from "../assets/assets";
import { dummyAdminDashboardData } from "../assets/assets";
import Loading from "../components/Loading";
import EmployeeDashboard from "../components/EmployeeDashboard";
import AdminDashboard from "../components/AdminDashboard";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {       
       api.get("/dashboard")
       .then((response) => {
        setData(response.data);         
         }) 
        .catch((error) => {
            console.error("Error fetching dashboard data:", error);
            toast.errror(error.response?.data?.error || error.response.message || "Failed to load dashboard data. Please try again.");
        })
        .finally(() => {
            setTimeout(() => {  
                setLoading(false);
            }, 1000); 
        });
    },[]);

    if (loading)  return  <Loading/>;
    if(!data) return <p className="text-center text-slate-500 py-12">No data available</p>

    if(data.role === "ADMIN") {
        return (
          <AdminDashboard data={data}/> 
        );
    }else {
        return (
           <EmployeeDashboard data={data}/>
        );
    }
}

export default Dashboard