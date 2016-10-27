var Group = props => (
  <div className='group'>
    <span className='group-name' onClick={() => props.clickHandler(props.name)}>{props.name}</span>
    <button className='group-edit'>Edit...</button>
  </div>
);

window.Group = Group;