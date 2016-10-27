class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  getLoginForm() {
    if (this.state.user) {
      return (<span className='logged-in-text'>Logged in as {this.state.user}</span>);
    } else {
      return (
        <form className='login-form'>
          Username: <input className='login-form-username' type='text' name='username' /><br/>
          Password: <input className='login-form-password' type='password' name='password' /><br/>
          <button onClick={this.login.bind(this)}>Login</button>
          <button onClick={this.signUp.bind(this)}>Sign up</button>
        </form>
      );
    }
  }

  login(e) {
    e.preventDefault();
    // post request to verify username/password combination
    $.ajax({
      url: '/users',
      method: 'POST',
      data: JSON.stringify({
        username: $('.login-form-username').val(),
        password: $('.login-form-password').val()
      }),
      contentType: 'application/json',
      success: (data) => {
        console.log('successful login: ', data);
        var user = $('.login-form-username').val();
        this.setState({user: user});
        this.props.login(user);
        this.props.getGroups(); // get user's groups
      },
      error: (err) => {
        console.error('login failed: ', err);
      }
    });

  }

  signUp(e) {
    e.preventDefault();
    // post request to sign up new user
    $.ajax({
      url: '/users',
      method: 'POST',
      data: JSON.stringify({
        username: $('.login-form-username').val(),
        password: $('.login-form-password').val(),
        newUser: true
      }),
      contentType: 'application/json',
      success: (data) => {
        console.log('successful signup: ', data);
        var user = $('.login-form-username').val();
        this.setState({user: user});
        this.props.login(user);
      },
      error: (err) => {
        console.error('signup failed: ', err);
      }
    });
  }

  render() {
    return (
      <div className='header'>
        <span className='title'>Freudian Antelopes</span>
        <button className='logout-button' style={{display: this.state.user ? 'inline' : 'none'}}>Log out</button>
        {this.getLoginForm()}
      </div>
    );
  }
}

window.Header = Header;