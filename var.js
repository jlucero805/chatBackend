const queries = {
	user: {
		del: `DROP TABLE user;`,
		create: `
			CREATE TABLE Users (
			Id serial NOT NULL PRIMARY KEY,
			Name VARCHAR(255) UNIQUE NOT NULL);
		`,
		add: name => `INSERT INTO Users (Name) VALUES ('${name}');`,
		getAll: `SELECT * FROM Users;`,
		getAllDetails: (name) => `
			SELECT *,
			ARRAY(
				SELECT json_build_object(
					'room', F.room,
					'friendid', F.friendid,
					'friendname', F.friendname
				)
				FROM Friend AS F
				WHERE F.userid = U.Id
			) AS friends
			FROM Users As U
			WHERE U.name = '${name}'
			LIMIT 1;
		`
	},
	friend: {
		drop: `DROP TABLE Friend;`,
		create: `CREATE TABLE Friend (
		UserId INT REFERENCES Users(Id),
		FriendId INT REFERENCES Users(Id),
		FriendName VARCHAR(255),
		room INT REFERENCES Room(Id) 
	);`,
		add: (userId, friendId, friendName, room) => `INSERT INTO Friend (UserId, FriendId, FriendName, room) VALUES (${userId}, ${friendId}, '${friendName}', ${room});`,
		get: 'SELECT * FROM Friend;',
		alter: `
		ALTER TABLE Friend
		ALTER COLUMN room ADD PRIMARY KEY;
	`,
		update: `
			UPDATE Friend
			SET userid = 100, friendid = 100;
		`
	},
	message: {
		drop: `DROP TABLE Message`,
		create: `
			CREATE TABLE Message (
				Id serial NOT NULL PRIMARY KEY,
				roomid INT REFERENCES Room(Id),
				fromname VARCHAR(255),
				body TEXT
			);
		`,
		add: (room, from, text) => `
			INSERT INTO Message (roomid, fromname, body)
			VALUES (${room}, '${from}', '${text}');
		`,
		get: (room) => `
				SELECT * FROM Message
				WHERE roomid = ${room}
		`,
		delete: `
				DELETE FROM Message;
		`
	},
	room: {
		drop: `DROP TABLE Room`,
		create: `
			CREATE TABLE Room (
				Id serial NOT NULL PRIMARY KEY
			);
		`,
		insert: `
			INSERT INTO Room VALUES(DEFAULT) RETURNING Id;
		`,
		delete: `DELETE FROM Room;`
	}
}

const poolDetails = {
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'password',
	port: 5432
}

const vars = {
	queries,
	poolDetails
}

module.exports = vars;