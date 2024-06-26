import express from "express";
import {Server} from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";


const app= express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    }
});

const port = process.env.PORT || 3000;
const secretKEy = "asdfghjklmnbvcxzasd"
app.get("/",(req,res)=>{
   
    res.end("dikshika"); 
}); 
io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,(err)=>{
        if(err)
            return next(err);
        const token = socket.request.cookies.token;
        if(!token)
            return next(new JsonWebTokenError("authentication fialed"))
        const decoded = jwt.verify(token,secretKEy);
        next();  

    })
})
app.get("/login",(req,res)=>{
    const token = jwt.sign({_id:"aaaaffimbmtaaaaa"},secretKEy);
    res.cookie("token",token,{secure:true,sammeSite:"none"}).json({
        message:"login success"
    })
}) 
// const user = true;

io.on("connection",(socket)=>{
    console.log(`user connected ,${socket.id}`);
    
    
socket.on("message",(data)=>{
   console.log(data.room)
   console.log(data.message)

    // socket.broadcast.emit("text",data);
    io.to(data.room).emit("text",data.message);
});
socket.on("room",(data)=>{
    socket.join(data);
    console.log("joined")
})
 socket.on("disconnect",()=>{
    console.log("disconnect");
 })

});
server.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
});