import React, { useEffect,useState, useContext } from 'react'
import axios from 'axios'; // Importing axios
import "./myStyles.css";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import logo from '../iconsco/live-chat -512px.png';
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import{myContext} from "./MainContainer";
import { useNavigate } from 'react-router-dom';
import {refreshSidebarFun} from "../Features/refreshSidebar";
import RefreshIcon from "@mui/icons-material/Refresh";


function Users() {
    const {refresh,setRefresh} = useContext(myContext);

    const lightTheme = useSelector(state => state.themekey);
    const [users,setUsers]=useState([]);
    const userData=JSON.parse(localStorage.getItem("userData"));
    const nav=useNavigate();
    const dispatch=useDispatch();

    if(!userData){
      console.log("User not Authenticated");
      nav(-1);
    }
    useEffect(()=>{
      const config ={
        headers:{
         Authorization: `Bearer ${userData.data.token}`,
        },
      };
      axios.get("http://localhost:5001/user/fetchUsers/",config).then((data)=>{
        console.log("UData refreshed in Users panel ");
        setUsers(data.data);
      });
    }, [refresh]);
  return (
    <AnimatePresence>
      <motion.div 
           initial={{opacity:0,scale:0}}
           animate={{opacity:1,scale:1}}
           exit={{opacity:1,scale:1}}
           transition={{
            ease:"anticipate",
            duration:"0.3",
           }}
          className='list-container'>
            <div className={`ug-header ${lightTheme ? "" : "dark"}`}>
            <img
            src={logo} alt='logo'
            style={{height:"2rem",width:"2rem"}}/>
            <p className={`ug-title ${lightTheme ? "" : "dark"}`}>
              Online Users
            </p>
              <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshIcon />
          </IconButton>
          </div>
           <div className={`sb-search ${lightTheme ? "" : "dark"}`}>
            <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
              <SearchIcon/>  
            </IconButton>
            <input placeholder="search" 
            className={`search-box ${lightTheme ? "" : "dark"}`}/>
        </div>
        <div className='ug-list'>
          {users.map((user,index) =>(
          <motion.div
                whileHover={{scale:1.01}}
                whileTap={{scale:0.98}}
                className={`list-tem ${lightTheme ? "" : "dark"}`}
                key={index}
                onClick={()=>{
                  const config={
                    headers:{
                      Authorization: `Bearer ${userData.data.token}`,
                  },
                };
                axios.post(
                  "http://localhost:5001/chat/",
                  {
                    userId:user._id,
                  },
                  config
                );
                dispatch(refreshSidebarFun());
              }}
          >
                <p className={`con-icon ${lightTheme ? "" : "dark"}`}>T</p>
                <p className={`con-title ${lightTheme ? "" : "dark"}`}>
                    {user.name}
                </p>
             </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Users;