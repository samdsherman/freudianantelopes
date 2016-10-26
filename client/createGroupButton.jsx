var CreateGroupButton = props => {
	// shows create group form when clicked

	if (props.createGroupClicked) {

		return (
			<div>
				<button onClick={props.openCreateGroupForm}>Create New Group</button>
				<CreateGroup />
			</div>
		);

	} else {
	
		return (
			<div>
				<button onClick={props.openCreateGroupForm}>Create New Group</button>
			</div>
		)
		
	}

};

window.CreateGroupButton = CreateGroupButton;
