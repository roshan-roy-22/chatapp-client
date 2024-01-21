import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://chat-app-server-qhfp.onrender.com/");
function App() {
  const [username, setUsername] = useState("");
  const [chatactive, setChatactive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewmessages] = useState("");
  const [usernames,setUsernames]=useState([]);

  const startChat = () => {
    if (username !== "") {
      socket.emit('connection', username);
      setChatactive(true);
    }
     socket.on('user-joined',(username)=>{
    usernames.push(username)
    console.log(usernames);
   })
  };

  useEffect(() => {
    socket.on("recieved-msg", (message) => {
        setMessages([...messages, message]);
    });

  //  socket.emit('connection',username)
  //  socket.emit('connection', username);
  
   
    return () => {
        socket.emit("ended");
        socket.off();
    };
}, [messages,username]);


  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = {
      message: newMessage,
      user: username,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    if (!newMessage == "") socket.emit("send-message", messageData);
    else alert("Please Enter any message");
    setNewmessages("");
  };
  return (
    <>
      <div className="w-screen h-screen bg-gray-200  flex justify-center items-center">
        {chatactive ? (
          <div>
            <h1
              className="text-center font-bold text-xl my-2
             uppercase"
            >
               Group Chat
            </h1>
            <div className="mx-auto p-2 rounded-md  w-full md:w-[80vw] lg:w-[40vw]">
              <div className="overflow-scroll h-[80vh] lg:h-[60vh">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex rounded-md shadow-md my-5 w-fit ${
                      username === message.user && "ml-auto"
                    }`}
                  >
                    <div className="bg-green-400 flex justify-center items-center rounded-l-md">
                      <h3 className="font-bold text-lg px-2">
                        {message.user.charAt(0).toUpperCase()}
                      </h3>
                    </div>
                    <div className="px-2 bg-white rounded-md  ">
                      <span className="text-sm">{message.user}</span>
                      <h3 className="font-bold">{message.message}</h3>
                      <h3 className="text-xs text-right">{message.time}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex justify-between   gap-2 md:gap-4"
              >
                <input
                  onChange={(e) => setNewmessages(e.target.value)}
                  className=" w-full py-2 rounded-md border-2 outline-none px-3 "
                  type="text"
                  value={newMessage}
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-white bg-green-500 rounded-md font-bold"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-screen h-screen flex justify-center items-center gap-2 ">
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              className="text-center px-3 py-2 outline-none border-2 rounded-md"
              placeholder="Enter your name"
            />
            <button
             onClick={startChat}
              className="bg-green-500 text-white px-3 py-2 rounded-md"
              type="submit"
            >
              Start chat
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
