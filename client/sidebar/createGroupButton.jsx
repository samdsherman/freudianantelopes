var CreateGroupButton = props => {
  // opens form to create a new group when clicked

  if (props.createGroupClicked) {

    return (
      <div>
        <div className='button-container'>
          <button className='createGroupButton btn btn-primary' onClick={props.openCreateGroupForm}>Create New Group</button>
        </div>
        <CreateGroup addToGroups={props.addToGroups} currentUser={props.currentUser} openCreateGroupForm={props.openCreateGroupForm}/>
      </div>
    );

  } else {
  
    return (
      <div>
        <div className='button-container'>
          <button className='btn btn-primary' onClick={props.openCreateGroupForm}>Create New Group</button>
        </div>
      </div>
    );
    
  }

};

CreateGroupButton.propTypes = {
  addToGroups: React.PropTypes.func, 
  currentUser: React.PropTypes.string, 
  createGroupClicked: React.PropTypes.bool, 
  openCreateGroupForm: React.PropTypes.func
};

window.CreateGroupButton = CreateGroupButton;
