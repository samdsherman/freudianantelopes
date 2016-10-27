class EditGroup extends React.Component {

// on click of 'edit..'
	// send a GET request to the server for specific information about group clicked
	// upon success
		// render create group form
			// pre-populate with information received from server

	constructor(props) {
    super(props);
    this.state = {
      memberForms: null,
      members: null
    };
  }

  // component will fetch group data before mounting
  componentWillMount() {
  	this.getGroup((data) => {
  		this.setState({members: data});

  		// loop through data
  			// for each member, render a pre-populated EditMember component
  				// concat EditMember component to this.state.memberForms
  	});	
  }

  getGroup(cb) {
  	$.ajax({
  		url: '/path',
  		method: 'GET',
  		success: (data) => {
  			console.log('Successful GET request for group info');
  			console.log(data);
  			cb(data);
  		},
  		error: (err) => {
  			console.log('Failed to GET group info');
  			console.log(err);
  			cb(err);
  		}
  	});
  }

  addGroupMember(e) {
    // render a new member form if user wants to add to current group
    e.preventDefault();
    this.setState({
      memberForms: this.state.memberForms.concat((<CreateMember />))
    });
  }

  handleSaveChangesClick (e) {
		// make PUT request to server with values from all inputs

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