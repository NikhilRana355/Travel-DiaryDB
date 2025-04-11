const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http");  // Import HTTP for socket.io
const { Server } = require("socket.io");  // Import Socket.io


const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
})); 

 // Create server for socket.io
const io = new Server (server, {
    cors: {
        origin: "http://localhost:5173", // Adjust as needed for your frontend
        methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => {
  res.send("Socket.IO server is running...");
});

app.use(cors())

const roleRoutes = require("./src/routes/RoleRoutes")
app.use(roleRoutes)

const userRoutes = require("./src/routes/UserRoutes")
app.use(userRoutes)

const stateRoutes = require("./src/routes/StateRoutes")
app.use("/state",stateRoutes) 

const cityRoutes = require("./src/routes/CityRoutes")
app.use("/city",cityRoutes) 

const DiaryRoutes = require("./src/routes/DiaryRoutes")
app.use("/diary",DiaryRoutes)

const itinerariesRoutes = require("./src/routes/ItinerariesRoutes")
app.use("/itin",itinerariesRoutes)

const CountryRoutes = require("./src/routes/CountryRoutes")
app.use("/country",CountryRoutes)

const profileRoutes = require("./src/routes/ProfileRoutes");
app.use("/profile", profileRoutes);

const notificationRoutes = require("./src/routes/NotificationRoutes")
app.use("/notifications",notificationRoutes)

const messageRoutes = require("./src/routes/MessageRoutes")
app.use("/message",messageRoutes)

const LikeRoutes = require("./src/routes/LikeRoutes")
app.use("/like",LikeRoutes)

const CommentRoutes = require('./src/routes/CommentRoutes')
app.use('/comments',CommentRoutes)

// Socket.IO Connection Handling
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  

// Expose Socket.io to use in other files
// app.set("io", io);

mongoose.connect("mongodb://127.0.0.1:27017/Travel_diary").then(()=>{
    console.log("database connected....")
})

const PORT = 3022
server.listen(PORT,()=>{
    console.log("server started on port number ",PORT)
    
})
