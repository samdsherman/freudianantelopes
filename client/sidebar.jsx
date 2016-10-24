var Sidebar = props => (
  <div className='sidebar'>
    <div className='sidebar-header'>Your groups:</div>
    <div className='sidebar-groups'>
      {props.groups.map(groupName => <Group name={groupName} />)}
    </div>
  </div>
);

window.Sidebar = Sidebar;