class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberForms: [
      	<CreateMember 
      		saveMember={this.saveMember.bind(this)} 
      		saveInstagram={this.saveInstagram.bind(this)} 
      		saveTwitter={this.saveTwitter.bind(this)} 
      		saveFacebook={this.saveFacebook.bind(this)} 
      	/>
      ],
      saveGroupClicked: false,
      groupName: '',
      groupMembers: [],
      instagramUsernames: [],
      twitterUsernames: [],
      facebookUsernames: []
    };
  }

  saveGroupName(e) {
  	// save group name into state
  	this.setState({
  		groupName: e.target.value
  	});
  }

  saveMember(e) {
  	// add member to groupMembers
  	this.setState({
  		groupMembers: this.state.groupMembers.concat(e.target.value)
  	});
  }

  saveInstagram(e) {
  	this.setState({
  		instagramUsernames: this.state.instagramUsernames.concat(e.target.value)
  	});
  }

  saveTwitter(e) {
  	this.setState({
  		twitterUsernames: this.state.twitterUsernames.concat(e.target.value)
  	});
  }

  saveFacebook(e) {
  	this.setState({
  		facebookUsernames: this.state.facebookUsernames.concat(e.target.value)
  	});
  }


  // render another CreateMember form
  addGroupMember(e) {
    e.preventDefault();
    this.setState({
      memberForms: this.state.memberForms
      .concat((
    		<CreateMember 
      		saveMember={'saved members: ', this.saveMember.bind(this)} 
      		saveInstagram={'saved IG: ', this.saveInstagram.bind(this)} 
      		saveTwitter={'saved twitter: ', this.saveTwitter.bind(this)} 
      		saveFacebook={'saved facebook: ', this.saveFacebook.bind(this)} 
    		/>
    	))
    });
  }

  handleSaveGroupClick() {
    // grab input values from all fields
      // format into an object
      // send POST request to server

    // destroy create group form
    console.log(this.state.groupName)
    console.log(this.state.groupMembers)
    console.log(this.state.instagramUsernames)
    console.log(this.state.twitterUsernames)
    console.log(this.state.facebookUsernames)
  }



  render() {
    return (
      // render on top of groups
      <div className='create-group-form'>
        <form className='add-group'>
          <input className='group-name' placeholder='Group Name' onBlur={this.saveGroupName.bind(this)}></input>
          <div ref='groupMembers'>
            {this.state.memberForms}
          </div>
          <a href='#' className='add-member-link' onClick={this.addGroupMember.bind(this)}>Add member</a>
        </form>
        <button className='save-group-button' onClick={this.handleSaveGroupClick.bind(this)}>Save Group</button>
      </div>
    );
  }
}

window.CreateGroup = CreateGroup;