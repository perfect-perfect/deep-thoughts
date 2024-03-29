import React from 'react';
import { useParams } from 'react-router-dom';
import ThoughtList from '../components/ThoughtList';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME} from '../utils/queries';
import FriendList from '../components/FriendList';
import { ADD_FRIEND } from '../utils/mutations';

const UserProfile = (props) => {

	const [addFriend] = useMutation(ADD_FRIEND);

	// useParams() retrieves the username from the URL, which is passed to the 'useQuery' Hook
	const { username: userParam } = useParams();

	const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
		variables: { username: userParam }
	});

	// used to populate the JSX
	const user = data?.me || data?.user || {};

	const handleClick = async () => {
		try {
			await addFriend({
				variables: { id: user._id }
			});
		} catch (e) {
			console.error(e);
		}
	}

	if (loading) {
		return <div>Loading...</div>;
	}


	return (
		<div>
			<div className="flex-row mb-3">
				<h2 className="bg-dark text-secondary p-3 display-inline-block">
					Viewing {user.username}'s profile.
				</h2>

				<button className="btn ml-auto" onClick={handleClick}>
					Add Friend
				</button>
			</div>

			<div className="flex-row justify-space-between mb-3">
				<div className="col-12 mb-3 col-lg-8">
					<ThoughtList
						thoughts={user.thoughts}
						title={`${user.username}'s thoughts...`}
					/>
				</div>

				<div className="col-12 col-lg-3 mb-3">
					<FriendList
						username={user.username}
						friendCount={user.friendCount}
						friends={user.friends}
					/>
				</div>

			</div>
		</div>
	);
};

export default UserProfile;
