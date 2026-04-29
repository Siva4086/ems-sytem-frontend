import React, { useState, useEffect, useCallback } from 'react';
import { dummyAttendanceData } from '../assets/assets';
import Loading from '../components/Loading';
import CheckInButton from '../components/Attendance/CheckInButton';
import AttendanceStats from '../components/Attendance/AttendanceStats';
import AttendanceHistory from '../components/Attendance/AttendanceHistory';
import api from "../api/axios";
import toast from 'react-hot-toast';

const Attendance = () => {
  const  [history, setHistory] = useState([]);
  const  [loading, setLoading] = useState(true);
  const  [isDeleted, setIsDeleted] = useState(false); 
  
  const fecthData = useCallback(async () => {
     try{
      const res = await api.get("/attendance");
      const json =res.data;
      setHistory(json.data || []);
      if(json.employee?.isDeleted) setIsDeleted(true);
     }catch(error){
      toast.error(error.response?.data?.error || error?.message || "Failed to fetch attendance data"); 
     }finally{
      setLoading(false);
     }
  }, []);

  useEffect(() => {
    fecthData();
  }, [fecthData]);

  if(loading) return <Loading />;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysRecord = history.find((record) => new Date(record.date).toDateString() === today.toDateString());


  return (
    <div className='animate-fade-in'>
      <div className='page-header'>
        <h1 className='page-title'>Attendance</h1>
        <p className='page-subtitle'>Track your work hours and daily check-ins</p>
      </div>
      {isDeleted ? (
         <div className='mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center'>
           <p className='text-rose-600'>You can no longer clock in or out because your employee records have been marked as deleted.</p>
         </div>

      ) : (
         <div className='mb-8'>
            <CheckInButton todayRecord={todaysRecord} onAction={fecthData} />
         </div>
      )}
      {/* <AttendanceStats/> */}
      <AttendanceStats history={history}/>
      {/* <AttendanceHistory/> */}
      <AttendanceHistory history={history}/>
    </div>
  )
}

export default Attendance