var CreateGroupButton = props => {
  // opens form to create a new group when clicked

  if (props.createGroupClicked) {

    return (
      <div>
        <button onClick={props.openCreateGroupForm}>Create New Group</button>
        <CreateGroup openCreateGroupForm={props.openCreateGroupForm}/>
      </div>
    );

  } else {
  
    return (
      <div>
        <button onClick={props.openCreateGroupForm}>Create New Group</button>
      </div>
    );
    
  }

};

window.CreateGroupButton = CreateGroupButton;
