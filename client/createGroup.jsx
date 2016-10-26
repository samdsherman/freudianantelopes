class CreateGroup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			memberForms: [<CreateMember />, <CreateMember />, <CreateMember />],
			saveGroupClicked: false
		};
	}

	addGroupMember() {
		// should render another CreateMember and append to the end
		// this.setState();
		
	}

	handleSaveGroupClick() {
		// grab input values from all fields
			// format into an object
			// send POST request to server

		// destroy create group form
	}



	render() {
		return (
			// render on top of groups
			<div className='create-group-form'>
				<form className='add-group'>
					<input className='group-name' placeholder='Group Name'></input>
					<div ref='groupMembers'>
						{this.state.memberForms}
					</div>
					<button className='add-another-member-button' onClick={this.addGroupMember}>Add another member</button>
				</form>
				<button className='save-group-button' onClick={this.handleSaveGroupClick}>Save Group</button>
			</div>
		);
	}
};

window.CreateGroup = CreateGroup;