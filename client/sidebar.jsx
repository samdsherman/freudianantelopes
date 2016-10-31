class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createGroupClicked: false
    };
  }

  openCreateGroupForm() {
    console.log('openCreateGroupForm called');
    this.setState({createGroupClicked: !this.state.createGroupClicked});
  }

  render(props) {
    return (
      <div className='sidebar'>
     
  
        <div className='sidebar-groups-header'>Your Groups:</div>
        <div className='sidebar-groups'>
          {this.props.groups.map(groupName => <Group getGroups={this.props.getGroups} currentUser={this.props.currentUser} currentGroup={this.props.currentGroup} name={groupName} setCurrentGroup={this.props.setCurrentGroup} />)}
        </div>
        <CreateGroupButton addToGroups={this.props.addToGroups} currentUser={this.props.currentUser} createGroupClicked={this.state.createGroupClicked} openCreateGroupForm={this.openCreateGroupForm.bind(this)}/>
      </div>
    );
  }
}

window.Sidebar = Sidebar;