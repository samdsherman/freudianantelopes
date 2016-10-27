class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberForms: [ <CreateMember /> ],
      groupName: ''
    };
  }

 	// save group name into state
  saveGroupName(e) {
  	this.setState({
  		groupName: e.target.value
  	});
  }

  // render another CreateMember form
  addMemberForm(e) {
    e.preventDefault();
    this.setState({
      memberForms: this.state.memberForms
      .concat((
    		<CreateMember groupMembers={this.state.groupMembers} />
    	))
    });
  }

  // send created group to server
  handleSaveGroupClick() {
    // grab input values from all fields
      // format into an object
      // send POST request to server

    // destroy create group form

    /*
		========= CREATE MEMBER OBJECTS TO BE SENT =============
    */
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

    /*
		========== SEND NEW GROUP TO SERVER ==============
    */

    $.ajax({
    	url: '/pages/',
    	method: 'POST',
    	data: {
    		group: this.state.groupName,
    		user: 'Ker', // <================================================= NEED TO UPDATE
    		members: allAccounts
    	},
    	success: function(data) {
    		console.log('POST REQUEST SUCCEEDED');
    	},
    	error: function(err) {
    		console.log('POST REQUEST FAILED')
    		console.log(err);
    	}
    });

    // close form after 'save group' is clicked
    this.props.openCreateGroupForm();
  }



  // render on top of groups
  render() {
    return (
      <div className='create-group-form'>
        <form className='add-group'>
          <input className='group-name' placeholder='Group Name' onBlur={this.saveGroupName.bind(this)}></input>
          <div ref='groupMembers'>
            {this.state.memberForms}
          </div>
          <a href='#' className='add-member-link' onClick={this.addMemberForm.bind(this)}>Add member</a>
        </form>
        <button className='save-group-button' onClick={this.handleSaveGroupClick.bind(this)}>Save Group</button>
      </div>
    );
  }
}

window.CreateGroup = CreateGroup;