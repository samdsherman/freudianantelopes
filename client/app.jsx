var decorateObject = function(fieldName, targetObject, value) {
  targetObject[fieldName] = value;
  return targetObject;
};

// this function changes a twitter post timestamp from a string to a number of seconds since january 1, 1970.
var fixTwitterTimestamp = function(post) {
  var parsed = Math.floor(Date.parse(post.timeStamp) / 1000);
  if (parsed) {
    post.timeStamp = parsed;
  }
  return post;
};

// converts post timestamp from a number of seconds since jan 1, 1970 to "3 hours ago" or whatever
var convertTimeStampToAgo = function(post) {
  var difference = Math.floor(Date.now() / 1000) - post.timeStamp;
  var timeStamp = '';
  if (difference < 60) {
    timeStamp = difference + ' second' + (difference !== 1 ? 's' : '') + ' ago';
  } else if (difference < 60 * 60) {
    var minutes = Math.floor(difference / 60);
    timeStamp = minutes + ' minute' + (minutes !== 1 ? 's' : '') + ' ago';
  } else if (difference < 60 * 60 * 24) {
    var hours = Math.floor(difference / 60 / 60);
    timeStamp = hours + ' hour' + (hours !== 1 ? 's' : '') + ' ago';
  } else if (difference < 60 * 60 * 24 * 30) {
    var days = Math.floor(difference / 60 / 60 / 24);
    timeStamp = days + ' day' + (days !== 1 ? 's' : '') + ' ago';
  } else if (difference < 60 * 60 * 24 * 30 * 12) {
    var months = Math.floor(difference / 60 / 60 / 24 / 30);
    timeStamp = months + ' month' + (months !== 1 ? 's' : '') + ' ago';
  } else {
    var years = Math.floor(difference / 60 / 60 / 24 / 30 / 12);
    timeStamp = years + ' year' + (years !== 1 ? 's' : '') + ' ago';
  }
  post.timeStampAgo = timeStamp;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      currentGroup: null,
      currentUser: null,
      posts: []
    };
  }

  getPosts() {
    $.ajax({
      url: '/pages/' + encodeURI(this.state.currentUser) + '/' + encodeURI(this.state.currentGroup),
      method: 'GET',
      success: (data) => {
        console.log('successful pages/user/group get', this.state.currentUser, this.state.currentGroup);
        var group = JSON.parse(data);
        console.log(group);
        if (!group) { // the group doesn't exist
          this.setState({
            posts: []
          });
        } else {
          var posts = [];
          group.members.forEach(member => { // collect up all the posts and decorate them with the poster's name.
            posts = posts.concat((member.twitter || []).map(post => fixTwitterTimestamp(decorateObject('name', post, member.name))))
                         // .concat((member.facebook || []).map(post => decorateObject('name', post, member.name)))
                         .concat((member.instagram || []).map(post => decorateObject('name', post, member.name)));
          });
          posts.sort((a, b) => b.timeStamp - a.timeStamp); // sort posts by newest first

          posts.forEach(convertTimeStampToAgo);

          this.setState({
            posts: posts
          });
        }
      }
    });
  }



  getGroups() {
    if (!this.state.currentUser) {
      this.setState({
        groups: [],
      });
      return;
    }

    $.ajax({
      url: '/users/' + encodeURI(this.state.currentUser),
      method: 'GET',
      success: (data) => {
        console.log('Successfully GET groups');
        this.setState({
          groups: data,
          currentGroup: this.state.currentGroup || data[0]
        }, this.getPosts.bind(this));
      },
      error: (err) => {
        console.log('Failed to GET groups');
        console.log(err);
      }
    });
  }

  addToGroups(group) {
    this.setState({
      groups: this.state.groups.concat(group)
    });
  }

  setCurrentGroup(group) {
    this.setState({
      currentGroup: group
    }, this.getPosts.bind(this));
  }

  setCurrentUser(user) {
    this.setState({
      currentUser: user
    }, this.getGroups.bind(this));
  }

  logout() {
    this.setState({
      currentUser: null,
      currentGroup: null,
      groups: [],
      posts: []
    });
  }

  render() {
    return (
      <div className='app'>
        <div className='app-header'>
          <Header login={this.setCurrentUser.bind(this)} logout={this.logout.bind(this)}/>
        </div>
        <div className='app-sidebar'>
          <Sidebar addToGroups={this.addToGroups.bind(this)} currentUser={this.state.currentUser} getGroups={this.getGroups.bind(this)} groups={this.state.groups} setCurrentGroup={this.setCurrentGroup.bind(this)} currentGroup={this.state.currentGroup} />
        </div>
        <div className='app-feed'>
          <Feed group={this.state.currentGroup} posts={this.state.posts} />
        </div>
      </div>
    );
  }
}

window.App = App;