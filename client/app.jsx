var decorateObject = function(fieldName, targetObject, value) {
  targetObject[fieldName] = value;
  return targetObject;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGroup: props.group
    };
  }

  getPosts() {
    // GET /pages/this.props.user/this.state.currentGroup
    var group = fakeData[this.state.currentGroup];

    if (!group) { // the group doesn't exist
      return [];
    }
    
    var posts = [];

    group.members.forEach(member => { // collect up all the posts and decorate them with the poster's name. TODO: still need to deal with timestamps later.
      posts = posts.concat((member.twitter || []).map(post => decorateObject('name', post, member.name)))
                   .concat((member.facebook || []).map(post => decorateObject('name', post, member.name)))
                   .concat((member.instagram || []).map(post => decorateObject('name', post, member.name)));
    });

    return posts;

  }



  getGroups() {
    if (!this.props.user) {
      return [];
    }
    return fakeData.groups; // replace with GET /users/this.props.user
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