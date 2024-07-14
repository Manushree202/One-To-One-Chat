import React, { useEffect } from 'react';
import logo from '../iconsco/live-chat -512px.png';
//import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Welcome() {
  //const lightTheme = useSelector((state) => state.themeKey);
  const navigate = useNavigate();

  // Initialize userData with null
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);

  useEffect(() => {
    // Check if userData is null or does not have the expected properties
    if (!userData || !userData.data || !userData.data.name) {
      console.log("User not Authenticated");
      navigate("/");
    }
  }, [userData, navigate]);

  // If userData is null or does not have the expected properties, return null to avoid rendering
  if (!userData || !userData.data || !userData.data.name) {
    return null;
  }

  return (
    <div className='welcome-container'>
      <motion.img
        drag
        whileTap={{ scale: 1.05, rotate: 360 }}
        src={logo}
        alt="logo"
        className='welcome-logo'
      />
      <b>Hi, {userData.data.name}</b>
      <p>View and text directly to people present in the chat Rooms.</p>
    </div>
  );
}

export default Welcome;
