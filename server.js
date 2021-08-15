const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "PUT", "DELETE"]
	}
})

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

io.on('connection', socket => {
	socket.on('chat message', (msg, room) => {
		io.to(room).emit('chat message', msg);
	});

	socket.on('send message', room => {
		io.to(room).emit('refresh messages');
	})

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('create', room => {
		socket.rooms.forEach(val => {
			socket.leave(val);
		});
		socket.join(room);
		console.log(socket.rooms);
		console.log('joined room');
	})
	io.emit('connection')
});

const loginRouter = require('./router/login');
const userRouter = require('./router/user');
app.use('/', loginRouter);
app.use('/', userRouter);

server.listen(3030, () => { console.log('listening on port 3030')});