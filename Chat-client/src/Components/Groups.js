import React, { useContext, useEffect, useState } from "react";
import "./myStyles.css";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import logo from '../iconsco/live-chat -512px.png';
import { useDispatch, useSelector } from "react-redux";
import RefreshIcon from "@mui/icons-material/Refresh";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function Groups() {
    // const [refresh, setRefresh] = useState(true);
    const { refresh, setRefresh } = useContext(myContext);

    const lightTheme = useSelector(state => state.themekey);
    const dispatch = useDispatch();
    const [groups, SetGroups] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    // console.log("Data from LocalStorage : ", userData);
    const nav = useNavigate();
    if (!userData) {
      console.log("User not Authenticated");
      nav("/");
    }

    const user = userData.data;
    useEffect(() => {
    console.log("Users refreshed : ", user.token);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

     axios
      .get("http://localhost:5001/chat/fetchGroups", config)
      .then((response) => {
        console.log("Group Data from API ", response.data);
        SetGroups(response.data);
      });
    }  , [refresh]);

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
           className={`list-container`}>
            <div className={`ug-header ${lightTheme ? "" : "dark"}`}>
                <img 
                src={logo} 
                style={{ height: "2rem", width: "2rem" }} 
                />
                <p className={`ug-title ${lightTheme ? "" : "dark"}`}>
                    Available Groups
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
                <IconButton className={`icon ${lightTheme ? "" : "dark"}`}>
                    <SearchIcon />
                </IconButton>
                <input 
                placeholder="search" 
                className={`search-box ${lightTheme ? "" : "dark"}`} />
            </div>
            <div className='ug-list'>
              {groups.map((group, index) => {
                return(
                <motion.div
                whileHover={{scale:1.01}}
                whileTap={{scale:0.98}}
                 className={`list-tem ${lightTheme ? "" : "dark"}`}
                 key={index}
                 onClick={() => {
                   const config ={
                    headers:{
                        Authorization: `Bearer ${user.token}`,
                    },
                   };
                   axios.put(
                     "http://localhost:5001/chat/addSelfToGroup",
                     {
                        chatId: group._id,
                        userId: userData.data._id,
                     },
                     config
                   );
                   // console.log(Join to group)
                   dispatch(refreshSidebarFun());
                 }}
                 >
                    <p className={`con-icon ${lightTheme ? "" : "dark"}`}>T</p>
                    <p className={`con-title ${lightTheme ? "" : "dark"}`}>
                      {group.chatName}
                    </p>
                </motion.div>
                );
             })}
           </div>
          </motion.div>   
        </AnimatePresence>
    );
}

export default Groups;
