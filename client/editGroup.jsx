class EditGroup extends React.Component {

// on click of 'edit..'
	// send a GET request to the server for specific information about group clicked
	// upon success
		// render create group form
			// pre-populate with information received from server

	constructor(props) {
    super(props);
    this.state = {
      memberForms: [<CreateMember />]
    };
  }

  addGroupMember(e) {
    // should render another CreateMember form
    e.preventDefault();
    this.setState({
      memberForms: this.state.memberForms.concat((<CreateMember />))
    });
  }

  handleSaveChangesClick (e) {

  	this.props.handleEditClick(e);
  }

	render() {
		return (
			<div className='edit-group-form'>
	        <form className='edit-group'>
	          <input className='edit-group-name' placeholder='Group Name'></input>
	          <div ref='groupMembers'>
	            {this.state.memberForms}
	          </div>
	          <button className='add-another-member-button' onClick={this.addGroupMember.bind(this)}>Add another member</button>
	        </form>
	        <button className='save-changes-button' onClick={this.handleSaveChangesClick.bind(this)}>Save Changes</button>
	      </div>
		);
	}
};

window.EditGroup = EditGroup;