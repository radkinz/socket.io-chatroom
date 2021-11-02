//set up socket
const socket = io();

//receive all chats when connected
socket.on('allChats', (chats) => {
	console.log(chats);

	//display chat array
	for (let i = 0; i < chats.length; i++) {
		$("#chats").append(chats[i].chat);
	}

});

//send new chats when button is clicked
$("button").click((event) => {
	//prevent default refresh page
	event.preventDefault()

	//send chat from input to server
	socket.emit("newChat", $("input").val());
})

//receive new chats and append them
socket.on("newChattoUsers", (msg) => {
	$("#chats").append(msg);
});
