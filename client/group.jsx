class Group extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editGroupForm: null,
			editGroupClicked: false
		};
	}	
	
	handleEditClick(e) {
		e.preventDefault();

		// if a click would change this.state.editGroupClicked to true,
		// we know a form should be generated after the click so we set the new state
		if (!this.state.editGroupClicked) {
			this.setState({
				editGroupForm: <EditGroup groupName={this.props.name} handleEditClick={this.handleEditClick.bind(this)}/>,
				editGroupClicked: true
			})
		} else {
			// if clicked again, the form hides from view
			this.setState({
				editGroupForm: null,
				editGroupClicked: false
			})
		}
	}

	render() {
		return (
	  <div className='group'>
	    <span className='group-name' onClick={() => this.props.clickHandler(this.props.name)}>{this.props.name}</span>
	    <a href='#' className='group-edit' onClick={this.handleEditClick.bind(this)}>Edit...</a>
	    {this.state.editGroupForm}
	  </div>
		);
	}
}

window.Group = Group;