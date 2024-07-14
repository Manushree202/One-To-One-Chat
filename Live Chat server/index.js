const express = require("express");
const dotenv=require("dotenv");
const {default: mongoose}=require("mongoose");
const cors=require("cors");
const UserRoutes=require("./Routes/UserRoutes");
const chatRoutes = require('./Routes/chatRoutes'); 
const messageRoutes=require('./Routes/messageRoutes');
const { notFound,errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
app.use(
  cors({
    origin:"*",
  })
);
dotenv.config();

app.use(express.json());

const connectDb = async()=> {
    try{
     const connect=await mongoose.connect(process.env.MONGO_URI);
     console.log("Server is Connnected to Db"); 
    }
    catch(err){
      console.log("Server is NOT connected to Databse",err.message);
    }
};
connectDb();

app.get("/",(req,res)=>{
   res.send("API iso running");
});
app.use("/user", UserRoutes);
app.use("/chat",chatRoutes);
app.use("/message",messageRoutes);

//Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server=app.listen(PORT, () =>{console.log("Server is Running...")});

const io=require("socket.io")(server,{
  cors: {
   origin:"*",
  },
  pingTimeout:60000,
})

io.on("connection",(socket)=>{
  //console.log("socket.io connection established");

  socket.on("setup",(user)=>{
    socket.join(user.data._id);
    //console.log("server ://joined user:",user.data._id);
    socket.emit("connected")
  });

  socket.on("join chat",(room)=>{
    socket.join(room);
    //console.log("Users joined Room:",room);
  });
  
  socket.on("new message",(newMessageStatus) =>{
    var chat=newMessageStatus.chat;
    if(!chat.users){
      return console.log("chats.user not defined");
    }
    chat.user.forEach((user) => {
      if(user._id==newMessageStatus.sender._id) return;

      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });
});