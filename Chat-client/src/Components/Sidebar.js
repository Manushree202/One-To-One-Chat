import React, { useContext, useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LightModeIcon from "@mui/icons-material/LightMode";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/themeSlice";
import axios from "axios";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function Sidebar() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();

  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData.data;

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get("http://localhost:5001/chat/", config)
      .then((response) => {
        console.log("Data refresh in sidebar ", response.data);
        setConversations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      });
  }, [refresh, user.token]);

  const getConversationName = (conversation) => {
    if (conversation.isGroupChat) {
      return conversation.groupName || "Test Group";
    } else {
      const otherUser = conversation.users.find(u => u._id !== user._id);
      return otherUser ? otherUser.name : "Unknown User";
    }
  };

  return (
    <div className={"sidebar-container" + (lightTheme ? "" : " dark")}>
      <div className="sb-header">
        <div className="other-icons">
          <IconButton onClick={() => nav("/app/welcome")}>
            <AccountCircleIcon className="icon" />
          </IconButton>
          <IconButton onClick={() => nav("users")}>
            <PersonAddIcon className="icon" />
          </IconButton>
          <IconButton onClick={() => nav("groups")}>
            <GroupAddIcon className="icon" />
          </IconButton>
          <IconButton onClick={() => nav("create-groups")}>
            <AddCircleIcon className="icon" />
          </IconButton>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {lightTheme && (<NightlightIcon className={"icon" + (lightTheme ? "" : " dark")} />)} 
            {!lightTheme && (<LightModeIcon className={"icon" + (lightTheme ? "" : " dark")}/>)}
          </IconButton>
          <IconButton
            onClick={() => {
              localStorage.removeItem("userData");
              nav("/");
            }}
          >
            <ExitToAppIcon className="icon" />
          </IconButton>
        </div>
      </div>
      <div className="sb-search">
        <IconButton className="icon">
          <SearchIcon />
        </IconButton>
        <input placeholder="Search" className="search-box" />
      </div>
      <div className="sb-conversations">
        {conversations.map((conversation, index) => {
          if (conversation.users.length === 1) {
            return <div key={index}></div>;
          }

          const conversationName = getConversationName(conversation);

          if (!conversation.latestMessage) {
            console.log("No Latest Message with ", conversationName);
            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  console.log("Refresh fired from sidebar");
                  dispatch(refreshSidebarFun());
                  setRefresh(!refresh);
                  nav(`chat/${conversation._id}&${conversationName}`);
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {conversationName[0]}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {conversationName}
                </p>
                <p className="con-lastMessage">
                  No previous Messages, click here to start a new chat
                </p>
                <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                  {conversation.timeStamp}
                </p>
              </div>
            );
          } else {
            console.log("Conversation with latest message: ", conversation);
            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  nav(`chat/${conversation._id}&${conversationName}`);
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {conversationName[0]}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {conversationName}
                </p>
                <p className="con-lastMessage">
                  {conversation.latestMessage.content}
                </p>
                <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                  {conversation.timeStamp}
                </p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Sidebar;
