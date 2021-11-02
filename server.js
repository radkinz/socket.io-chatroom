//load in dependencies/setup server
const express = require('express');
const mustache = require('mustache-express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const sqlite3 = require("sqlite3");

//setup app
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + "/views");
app.set('view engine', 'mustache');
app.engine('mustache', mustache());

//connect to database
let db = new sqlite3.Database("./chatlog.db", 
	sqlite3.OPEN_READWRITE, 
	(err) => { 
		console.log(err);
	});

//create table *comment out because only run once!*
//db.run("CREATE TABLE chatlog(chat TEXT)");

//display the home page
app.get("/", (req, res) => {
	res.render('home');
});

//connect new user
io.on('connection', (socket) => {  
	console.log('a user connected');

	//send new user all chat messages from database
	db.all("SELECT * FROM chatlog", function(err, result) {
			//print error
			if (err) console.log(err);

			console.log(result);

			//send new chat to all connected users
			socket.emit("allChats", result);
		});

	//listen for new messages
	socket.on("newChat", (newChat) => {
		//add chat to database
		db.run("INSERT INTO chatlog VALUES (?)", newChat);

		//send out new chat to connected users
		io.emit("newChattoUsers", newChat);
	});
});

//listen to server
server.listen(3000, () => {  
	console.log('listening on *:3000');
});