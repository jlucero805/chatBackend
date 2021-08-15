const userRouter = require('express').Router();
const vars = require('../var');

const Pool = require('pg').Pool;
const pool = new Pool(vars.poolDetails);

userRouter.get('/:name', (req, response) => {
	pool.query(vars.queries.user.getAllDetails(req.params.name), (err, res) => {
		console.log(res.rows);
		if (res.rows) {
			response.json(res.rows[0]).status(200);
		} else {
			response.json({ response: false }).status(200);
		}
	});
});

userRouter.post('/send', (req, response) => {
	pool.query(vars.queries.message.add(req.body.room, req.body.from, req.body.text), (err, res) => {
		response.sendStatus(200);
	})
})

userRouter.get('/messages/:roomid', (req, response) => {
	pool.query(vars.queries.message.get(req.params.roomid), (err, res) => {
		response.json({messages: res.rows}).status(200);
	})
})

userRouter.post('/newRoom', (req, response) => {
	pool.query(vars.queries.room.insert, (err, res) => {
		response.json({room: res.rows[0].id}).status(200);
	})
})

module.exports = userRouter;