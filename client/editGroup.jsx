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

  sendChanges(members) {
  	$.ajax({
  		url: '/path',
  		method: 'PUT',
  		data: {
  			newGroupName: 'Warriors', // <============================= NEED UPDATE
  			oldGroupName: 'Warriors', // <============================= NEED UPDATE
  			user: 'Ker', // <================================== NEED UPDATE
  			members: members
  		},
  		sucess: (data) => {
  			console.log('Successful PUT request');
  		},
  		error: (err) => {
  			console.log('PUT request failed');
  			console.log(err);
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

  // get accounts for all members
  getMembers() {
    var groupMemberNodes = ReactDOM.findDOMNode(this.refs.groupMembers).children;

    var allAccounts = []; // accounts for all members in the group

    for (var i = 0; i < groupMemberNodes.length; i++) {
      var inputNodes = groupMemberNodes[i].children;

      var memberObj = {};

      for (var j = 0; j < inputNodes.length; j++) {
        var inputField = inputNodes[j].className;
        var inputValue = inputNodes[j].value;

        if (inputField === 'member-name') {
          memberObj.name = inputValue;
        } else if (inputField === 'ig-username') {
          memberObj.instagram = inputValue;
        } else if (inputField === 'twitter-username') {
          memberObj.twitter = inputValue;
        } else if (inputField === 'facebook-username') {
          memberObj.facebook = inputValue;
        }
      }

      allAccounts.push(memberObj);
    }

    return allAccounts;
  }

  handleSaveChangesClick (e) {
		// make PUT request to server with values from all inputs
		var members = getMembers();

		this.sendChanges(members);

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