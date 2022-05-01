import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { setContext } from '@apollo/client/link/context';
import React from 'react';
import Header from './components/Header';
// import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile'

// extablish a new link to the GraphQL server at its '/graphql' endpoint
const httpLink = createHttpLink({
	uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('id_token');
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

// use the 'ApolloClient()' contructor to instantiate the Apollo Client instance
const client = new ApolloClient({
	// create the connection to the API endpoint and attack the token header to every request
	link: authLink.concat(httpLink),
	// instantiate a new cache object using 'new InMemoryCache()'
	cache: new InMemoryCache(),
});

function App() {
	return (
		// because we're passing the 'client' variable in as the value for the 'client' prop in the provider
		//	- we'll have access to the server's API, because we set up 'client' to have access to that
		<ApolloProvider client={client}>
			<Router>
				<div className='flex-column justify-flex-start min-100-vh'>
					<Header />
					<div className='container'>
						<Routes>

							<Route path='/' element={<Home />} />

							<Route path='/login' element={<Login />} />

							<Route path='/signup' element={<Signup />} />

							<Route path='/profile/:username' element={<Profile />} />

							<Route path='/profile' element={<UserProfile />} />

							<Route path='/thought/:id' element={<SingleThought />} />

							<Route path="*" element={<NoMatch />} />

						</Routes>
					</div>
				</div>
			</Router>
		</ApolloProvider>
	);
}

export default App;
