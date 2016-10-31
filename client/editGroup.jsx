class EditGroup extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      memberForms: []
    };
  }

  // component will fetch group data before mounting
  componentWillMount() {
    this.getGroup((members) => {
      console.log(members)

      for (var i = 0; i < members.length; i++) {
        this.setState({
          memberForms: this.state.memberForms.concat(( 
            <EditMember
              name={members[i].name}
              instagram={members[i].instagramHandle}
              twitter={members[i].twitterHandle}
            />
          ))
        });
      }
    });
  }

  getGroup(cb) {
  	$.ajax({
  		url: '/pages/' + encodeURI(this.props.currentUser) + '/' + encodeURI(this.props.currentGroupName),
  		method: 'GET',
      contentType: 'application/json',
  		success: (data) => {
        data = JSON.parse(data);
  			console.log('Successful GET request for group info');
  			cb(data.members);
  		},
  		error: (err) => {
  			console.log('Failed to GET group info');
  			console.log(err);
  			cb(err);
  		}
  	});
  }

  sendChanges(newGroupName, members) {
  	$.ajax({
  		url: '/pages/' + encodeURI(this.props.currentUser) + '/' + encodeURI(this.props.currentGroupName),
  		method: 'PUT',
  		data: JSON.stringify({
  			newGroupName: newGroupName,
  			oldGroupName: this.props.currentGroupName,
  			username: this.props.currentUser,
  			members: members
  		}),
      contentType: 'application/json',
  		sucess: (data) => {
        // server does not return anything for successful PUT request
        // if no error, assume successful
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

  // retrieve value from group name field in case user has changed it
  getNewGroupName() {
    return ReactDOM.findDOMNode(this.refs.newGroupName).value;
  }

  // retrieve values from input fields for all members
  getMembers() {
    var groupMemberNodes = ReactDOM.findDOMNode(this.refs.groupMembers).children;

    var allAccounts = {}; // accounts for all members in the group

    for (var i = 0; i < groupMemberNodes.length; i++) {
      var inputNodes = groupMemberNodes[i].children;

      var memberObj = {};

      for (var j = 0; j < inputNodes.length; j++) {
        var inputField = inputNodes[j].className;
        var inputValue = inputNodes[j].value;

        if (inputField === 'member-name') {
          allAccounts[inputValue] = memberObj;
        } else if (inputField === 'ig-username') {
          memberObj.instagram = inputValue;
        } else if (inputField === 'twitter-username') {
          memberObj.twitter = inputValue;
        } 
      }
    }

    return allAccounts;
  }

  handleSaveChangesClick (e) {
		// make PUT request to server with values from all inputs
		var members = this.getMembers();

    var newGroupName = this.getNewGroupName();

		this.sendChanges(newGroupName, members);
    
    // setting the current group updates the feed--
    // this updates the feed if the group being edited is currently
    // the group being displayed
    if (this.props.currentGroup === this.props.currentGroupName) {
      this.props.setCurrentGroup(newGroupName);
    }
    
    // fetches groups with changes for sidebar
    this.props.getGroups();

    // closes the edit form
  	this.props.handleEditClick(e);
  }

	render() {
		return (
			<div className='edit-group-form'>
	        <form className='edit-group'>
	          <input ref='newGroupName' className='edit-group-name' placeholder='Group Name' defaultValue={this.props.currentGroupName}></input>
	          <div ref='groupMembers'>
	            {this.state.memberForms}
	          </div>
            <div className='add-member-link'>
	           <a href='#' onClick={this.addGroupMember.bind(this)}>add another member</a>
            </div>
	        </form>
          <div className='button-container'>
	        <button className='save-changes-button btn btn-primary' onClick={this.handleSaveChangesClick.bind(this)}>Save Changes</button>
          </div>
	      </div>
		);
	}
};

window.EditGroup = EditGroup;