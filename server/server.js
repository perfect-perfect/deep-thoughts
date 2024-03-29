const path = require('path');

const express = require('express');

//import ApolloServer
const { ApolloServer } = require('apollo-server-express');

//import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

// import auth middle ware function
const { authMiddleware } = require('./utils/auth');

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
	// create a new Apollo server and pass in our schema data
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: authMiddleware
	});

	// start the Apollo server
	await server.start();

	// integrate our Apollo server with the Express application as middlewate
	// this will create a special '/graphql' endpoint for the 'Express.js' server
	server.applyMiddleware({ app });

	// log where we can goto test our GQL API
	console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
}

// initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.get('*', (req, res) => {
// 	res.status(404).sendFile(path.join(__dirname, './public/404.html'))
// })

// serve up static assets
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
	app.listen(PORT, () => {
		console.log(`API server running on port ${PORT}!`);
	});
});

