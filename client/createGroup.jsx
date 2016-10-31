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
  sendGroup(members) {
    $.ajax({
      url: '/pages/' + encodeURI(this.props.currentUser) + '/' + encodeURI(this.state.groupName),
      method: 'POST',
      data: JSON.stringify({
        groupName: this.state.groupName,
        username: this.props.currentUser,
        members: members
      }),
      contentType: 'application/json',
      success: (data) => {
        console.log('POST REQUEST SUCCEEDED');
      },
      error: (err) => {
        console.log('POST REQUEST FAILED');
        console.log(err);
      }
    });
  }

  // retrieve group member accounts from input fields
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


  handleSaveGroupClick() {
    var members = this.getMembers();
  
    this.sendGroup(members);  

    // close form after 'save group' is clicked
    this.props.openCreateGroupForm();

    // add new group to group list in sidebar
    this.props.addToGroups(this.state.groupName);
  }



  // render on top of groups
  render() {
    return (
      <div className='create-group-form'>
        <form className='add-group'>
          <input className='group-name-input' placeholder='Group Name' onBlur={this.saveGroupName.bind(this)}></input>
          <div ref='groupMembers'>
            {this.state.memberForms}
          </div>
          <div className='add-member-link'>
            <a href='#' onClick={this.addMemberForm.bind(this)}>add another member</a>
          </div>
        </form>
        <div className='button-container'>
          <button className='save-group-button btn btn-primary' onClick={this.handleSaveGroupClick.bind(this)}>Save Group</button>
        </div>
      </div>
    );
  }
}

window.CreateGroup = CreateGroup;