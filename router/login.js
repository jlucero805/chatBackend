const loginRouter = require('express').Router();
const vars = require('../var');

const Pool = require('pg').Pool;
const pool = new Pool(vars.poolDetails);

loginRouter.post('/login', (req, response) => {
	pool.query(vars.queries.user.getAll, (err, res) => {
		console.log(res.rows)
		let names = res.rows;
		if (names.find(n => n.name === req.body.name)) {
			response.json({ response: true }).status(200);
		} else {
			response.json({ response: false }).status(200);
		}
	});
});

loginRouter.get('/do', (req, response) => {
	pool.query(
		vars.queries.friend.add(1, 2, "Juan", 2),
		(err, res) => {
		console.log(err, res)

	})
})
loginRouter.get('/do1', (req, response) => {
	pool.query(
		vars.queries.friend.add(2, 1, "Jason", 2),
		(err, res) => {
		console.log(err, res)

	})
})
loginRouter.get('/do2', (req, response) => {
	pool.query(
		vars.queries.room.create,
		(err, res) => {
		console.log(err, res)

	})
})

module.exports = loginRouter;
