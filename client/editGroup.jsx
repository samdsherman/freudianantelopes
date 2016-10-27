class EditGroup extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      memberForms: []
    };
  }

  // component will fetch group data before mounting
  componentWillMount() {
  	
  // 	// ============= WORKING EXAMPLE ============
  // 	this.setState({
		// 	memberForms: this.state.memberForms[0] =
		// 		<EditMember 
		// 			name={'Ker'}
		// 			instagram={'ker-ig'}
		// 			twitter={'ker-twitter'}
		// 			facebook={'ker-fb'}
		// 		/>
			
		// });
		// // ==========================================

  	this.getGroup((data) => {

  		// loop through data
  			// for each member, render a pre-populated EditMember component (use defaultValue=)
  				// first component will not be able to be concatenated--must add to array[0]
  				// concat EditMember component to this.state.memberForms

  		//=====NEED TO EDIT: where in data is members array?=======	
  		// data.members.forEach((member) => {
  		// 	this.setState({
  		// 		memberForms: this.state.memberForms
  		// 		.concat((
  		// 			<EditMember 
  		// 				name={}
  		// 				instagram={}
  		// 				twitter={}
  		// 				facebook={}
  		// 			/>
  		// 		))
  		// 	});
  		// });
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
	          <input className='edit-group-name' placeholder='Group Name' defaultValue={this.props.groupName}></input>
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