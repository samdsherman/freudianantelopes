var CreateMember = props => (
	<div className='group-member'>
		<input className='member-name' placeholder='Name'></input>
		<input className='ig-username' placeholder='Instagram Username'></input>
		<input className='twitter-username' placeholder='Twitter Username'></input>
	</div>
);

CreateMember.propTypes = {
	// none
};

window.CreateMember = CreateMember;