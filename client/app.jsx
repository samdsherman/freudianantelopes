class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGroup: props.group
    };
  }

  getPosts() {
    return [this.state.currentGroup, 'potato'];
  }

  getGroups() {
    if (!this.props.user) {
      return [];
    }
    return ['Warriors', 'Lakers', 'Trolls'];
  }

  setCurrentGroup(group) {
    this.setState({
      currentGroup: group
    });
  }

  render() {
    return (
      <div className='app'>
        <div className='app-sidebar'>
          <Sidebar groups={this.getGroups()} groupClickHandler={this.setCurrentGroup.bind(this)} />
        </div>
        <div className='app-feed'>
          <Feed group={this.state.currentGroup} posts={this.getPosts()} />
        </div>
      </div>
    );
  }
}



ReactDOM.render(<App user='sam' group='Warriors' />, document.getElementById('app'));

window.App = App;