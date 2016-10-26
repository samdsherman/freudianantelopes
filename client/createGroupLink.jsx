var CreateGroupLink = props => {
	if (props.createGroupClicked) {

		return (
			<div>
				<button onClick={props.openCreateGroupForm}>Create Group</button>
				<CreateGroup />
			</div>
		);

	} else {
	
		return (
			<div>
				<button onClick={props.openCreateGroupForm}>Create Group</button>
			</div>
		)
		
	}

};

window.CreateGroupLink = CreateGroupLink;
