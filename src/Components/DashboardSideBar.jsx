import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../Redux/Slice/UserSlice";


const DashboardSideBar = () => {
  const location = useLocation();
  const dispatch=useDispatch()
  const [tab, setTab] = useState("");

  const {currentuser}=useSelector((state)=>state.user)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const taburl = urlParams.get("tab"); //tab=profile
    if (taburl) {
      setTab(taburl);
    }
  }, [location.search]);
  const handleSignout=()=>{
    dispatch(signoutSuccess())
    localStorage.removeItem('Token')
    
  }
  return (
    <Sidebar className="w-full md:w-58">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              label={currentuser.rest.isAdmin ? 'Admin':'User'}
              labelColor="dark"
              icon={HiUser}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentuser.rest.isAdmin && (
            <Link to="/dashboard?tab=posts">
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              labelColor='dark'
              as='div'
            >
              Posts
            </Sidebar.Item>
          </Link>
          )}
          <Sidebar.Item icon={HiArrowSmRight} className="curser-pointer" onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardSideBar;
