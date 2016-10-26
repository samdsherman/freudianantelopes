var CreateMember = props => {


	return (
		<div className='group-member'>
			<input className='member-name' placeholder='Name'></input>
			<input className='ig-username' placeholder='Instagram Username'></input>
			<input className='twitter-username' placeholder='Twitter Username'></input>
			<input className='facebook-username' placeholder='Facebook Username'></input>
		</div>
	);
}

window.CreateMember = CreateMember;