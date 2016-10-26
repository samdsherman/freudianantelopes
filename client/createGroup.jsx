class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberForms: [<CreateMember />],
      saveGroupClicked: false
    };
  }

  addGroupMember(e) {
    // should render another CreateMember and append to the end
    // this.setState();
    e.preventDefault();
    this.setState({
      memberForms: this.state.memberForms.concat((<CreateMember />))
    });
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
          <button className='add-another-member-button' onClick={this.addGroupMember.bind(this)}>Add another member</button>
        </form>
        <button className='save-group-button' onClick={this.handleSaveGroupClick.bind(this)}>Save Group</button>
      </div>
    );
  }
}

window.CreateGroup = CreateGroup;