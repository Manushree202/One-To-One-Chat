const express = require("express");
const { 
    loginController,
    registerController,
    fetchALLUsersController,
} = require("../Controllers/userController");

const {protect}= require("../middlewares/authMiddleware");

const Router = express.Router();

Router.post('/login',loginController);
Router.post('/register',registerController);
Router.get("/fetchUsers",protect,fetchALLUsersController);

module.exports =Router;