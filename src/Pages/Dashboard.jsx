import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardProfile from '../Components/DashboardProfile';
import DashboardSideBar from '../Components/DashboardSideBar';

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const taburl = urlParams.get("tab"); //tab=profile
      if (taburl) {
        setTab(taburl);
      }
    }, [location.search]);
    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <div className='md-w-58'>
                <DashboardSideBar />
            </div>
            {tab==='profile' && <DashboardProfile />}
        </div>
    );
};

export default Dashboard;