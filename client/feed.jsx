var Feed = props => {
	if (!props.currentUser) {
		return (
			<div className='feed'>
				<h1><b>What is Pheed?</b></h1>
				<div>
					<h3>A service to compile all the social media content of different people you want to follow in one place.
					You can create different groups to follow and it takes just one click to see all the latest updates.</h3>
				</div>
				<h1><b>How to use Pheed:</b></h1>
				<div>
					<h3>Create an account</h3>
					<p>Enter your <i>username</i> and <i>password</i> and click <b>Sign Up</b>!</p>
					<h3>Create a group</h3>
					<p>Click <i>Create New Group</i> and add all of the accounts you would like to follow. <br />
					<b>Don't forget to name your <u>group</u> and give each <u>member</u> a name of your choice!</b></p>
				</div>
			</div>
		);
	} else {
		return (
		  <div className='feed'>
		    <div className='feed-header'>{props.group}</div>
		    <div className='feed-posts'>
		      {props.posts.map(post => <Post post={post} />)}
		    </div>
		  </div>
		);		
	}

}

window.Feed = Feed;