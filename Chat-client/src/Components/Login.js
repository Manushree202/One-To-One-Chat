import React, { useState } from 'react';
import logo from '../iconsco/live-chat -512px.png';
import { Backdrop, Button, CircularProgress, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Toaster from "./Toaster";

function Login() {
  const [showlogin,setShowlogin]=useState(false);
  const [data,setData]=useState({name: "", email: "",password: "" });
  const [loading,setLoading]=useState(false);
  
  const [logInStatus,setLogInStatus]=useState("");
  const [signInStatus,setSignInStatus]=useState("");

  const navigate = useNavigate();

  const changeHandler=(e)=>{
    setData({ ...data,[e.target.name]:e.target.value});
  };

  const loginHandler = async(e)=>{
    setLoading(true);
    console.log(data);
    try{
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };
      const response = await axios.post(
        "http://localhost:5001/user/login/",
        data,
        config
      );
      console.log("Login: ",response);
      setLogInStatus({ msg: "Success",key: Math.random()});
      setLoading(false);
      localStorage.setItem("userData", JSON.stringify(response));
      navigate("/app/welcome");
     } catch(error){
      setLogInStatus({
        msg:"Invalid Username or Password",
        key:Math.random(),
      })
     }
     setLoading(false);
  };

  const signUpHandler = async()=>{
    setLoading(true);
    try{
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };
      const response = await axios.post(
        "http://localhost:5001/user/register/",
        data,
        config
      );
      console.log("Login: ",response);
      setSignInStatus({ msg: "Success",key: Math.random()});
      navigate("/app/welcome");
      localStorage.setItem("userData", JSON.stringify(response));
      setLoading(false);
    } catch(error){
      console.log(error);
      if(error.response && error.response.status===405){
        setLogInStatus({
          msg:"User with this Email ID already Exists",
          key:Math.random(),
        });
      }
      setLoading(false);
    }
  };

  return (
    <>
    <Backdrop
    sx={{color:"#fff",zIndex:(theme)=>theme.zIndex.drawer +1}}
    open={loading}
    >
      <CircularProgress color='secondary'/>
    </Backdrop>
    
    <div className='login-container'>
        <div className='image-container'>
            <img src={logo} alt="logo" className='welcome-logo'/>
        </div>
        {showlogin && (
        <div className='login-box'>
            <p className='login-text'>Login to your Account</p>
            <TextField 
            onChange={changeHandler}
            id="standard-basic" 
            label="Enter User Name" 
            variant="outlined" 
            color='secondary'
            name='name'
            />
            <TextField 
            onChange={changeHandler}
            id="outlined-password-input" 
            label="Password" 
            type="password"
            autoComplete='current-password'
            color='secondary'
            name='password'
            onKeyDown={(event) => {
              if (event.code == "Enter") {
                // console.log(event);
                loginHandler();
              }
            }}
            />
            <Button 
            variant="outlined"
            color='secondary'
            onClick={loginHandler}
            isLoading
            >
              Login
              </Button>
              <p>
                Don't have an Account ?{" "}
                <span
                className='hyper'
                onClick={()=>{
                  setShowlogin(false);
                }}
                >
                  Sign Up
                </span>
              </p>
              {logInStatus ?(
                <Toaster key={logInStatus.key} message={logInStatus.msg}/>
              ) :null}
        </div>
        )}
        {!showlogin && (
          <div className='login-box'>
          <p className='login-text'>Create your Account</p>
          <TextField 
          onChange={changeHandler}
          id="standard-basic" 
          label="Enter User Name" 
          variant="outlined" 
          color='secondary'
          name='name'
          helperText=""
          onKeyDown={(event) => {
            if (event.code == "Enter") {
              // console.log(event);
              signUpHandler();
            }
          }}
          />
          <TextField 
          onChange={changeHandler}
          id="standard-basic" 
          label="Enter Email Address" 
          variant="outlined" 
          color='secondary'
          name='email'
          onKeyDown={(event) => {
            if (event.code == "Enter") {
              // console.log(event);
              signUpHandler();
            }
          }}
          />
          <TextField 
          onChange={changeHandler}
          id="outlined-password-input" 
          label="Password" 
          type="password"
          autoComplete='current-password'
          color='secondary'
          name='password'
          onKeyDown={(event) => {
            if (event.code == "Enter") {
              // console.log(event);
              signUpHandler();
            }
          }}
          />
          <Button 
          variant="outlined"
          color='secondary'
          onClick={signUpHandler}
          >
            Sign Up
            </Button>
            <p>
              Already have an Account ?{" "}
              <span
              className='hyper'
              onClick={()=>{
                setShowlogin(true);
              }}
              >
                Login in
              </span>
            </p>
            {logInStatus ?(
              <Toaster key={signInStatus.key} message={signInStatus.msg}/>
            ) :null}
      </div>
      )}
    </div>
    </>
  )
}

export default Login