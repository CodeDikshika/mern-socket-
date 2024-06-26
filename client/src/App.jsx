import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Box, Container, Stack, TextField, Typography } from "@mui/material";
const App = () => {
  const socket = useMemo(() => io("http://localhost:3000",{
    withCredentials:true,  
  }),  []);
  // ;
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setsocketID] = useState("");
  const [arr, setarr] = useState([]);
  const [roomName,setRoomName] =useState("");
  
  console.log(arr);
  const handlesubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  const handlejoinRoom = (e)=>{
    e.preventDefault();
     socket.emit("room",roomName);
     setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      setsocketID(socket.id);
      console.log(`bete ${socket.id}`);
    });

    socket.on("text", (data) => {
      setarr((arr) => [...arr, data]);
      // console.log(arr);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 200 }} />
      <Typography variant="p" component="div" gutterBottom>
        {socket.id}
      </Typography>
      <form onSubmit={handlejoinRoom}>
        <TextField onChange={(e) => setRoomName(e.target.value)}
          id="outlined"
          label="roomName"
          variant="outlined" />

<button variant="contained" color="primary" type="submit">
          join
        </button>
      </form>

      <form onSubmit={handlesubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlinedBasic"
          label="message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined"
          label="room"
          variant="outlined"
        />

        <button variant="contained" color="primary" type="submit">
          Send
        </button>
      </form>
      <Stack> 
        {arr.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
