var CreateMember = props => {
	return (
		<div className='group-member'>
			<input className='member-name' placeholder='Name' onBlur={props.saveMember}></input>
			<input className='ig-username' placeholder='Instagram Username' onBlur={props.saveInstagram}></input>
			<input className='twitter-username' placeholder='Twitter Username' onBlur={props.saveTwitter}></input>
			<input className='facebook-username' placeholder='Facebook Username' onBlur={props.saveFacebook}></input>
		</div>
	);
}

window.CreateMember = CreateMember;