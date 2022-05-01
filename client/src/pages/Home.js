import React from 'react';
// we're importing the 'useQuery' Hook from Apollo Client
//  - this allows us to 
//    - make requests to the GraphQL server we connected
//    - and made available to the application using the '<ApolloProvider>' component in 'App.js' earlier
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import Auth from '../utils/auth';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';

const Home = () => {
	// use useQuery hook to make query request
	const { loading, data } = useQuery(QUERY_THOUGHTS);

	// use object destructuring to extracr 'data' from the 'useQuery' Hook's response and rename it 'userData' to be more descriptive
	const { data: userData } = useQuery(QUERY_ME_BASIC);

	// if there is a token in local storage this is 'true'
	const loggedIn = Auth.loggedIn();


	// - what we're saying is
	// 		- if 'data' exists
	// 			- store it in the 'thoughts' constant we just created
	// 		- if 'data' is undefined
	//			- then save an empty array to the 'thoughts' components
	const thoughts = data?.thoughts || [];
	console.log(thoughts);

	return (
		<main>
			<div className="flex-row justify-space-between">
				{loggedIn && (
					<div className="col-12 mb-3">
						<ThoughtForm />
					</div>
				)}
				<div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
					{loading ? (
						<div>Loading...</div>
					) : (
						<ThoughtList thoughts ={thoughts} title="Some Feed for Thought(s)..." />
					)}
				</div>
				{loggedIn && userData ? (
					<div className='col-12 col-lg-3 mb-3'>
						<FriendList
							username={userData.me.username}
							friendCount={userData.me.friendCount}
							friends={userData.me.friends}
						/>
					</div>
				): null }
			</div>
		</main>
	);
};

export default Home;
