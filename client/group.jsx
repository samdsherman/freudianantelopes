var Group = props => (
  <div className='group'>
    <span className='group-name'>{props.name}</span>
    <a href='#' className='group-edit'>Edit...</a>
  </div>
);

window.Group = Group;