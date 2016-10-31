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
        <span>
        <form className='login-form'>
          Username: <input className='login-form-username' type='text' name='username' /><br/>
          Password: <input className='login-form-password' type='password' name='password' /><br/>
          <button className='btn btn-primary' onClick={this.login.bind(this)}>Login</button>
          <button className='btn btn-primary' onClick={this.signUp.bind(this)}>Sign up</button>
        </form>
        </span>
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

  logout() {
    this.props.logout();
    this.setState({
      user: null
    });
  }

  render() {
    return (
      <div className='header'>
        <a href="http://hackreactor.com">
        <img className='hackreactor-tag' src="http://i.imgur.com/x86kKmF.png" alt="Built at Hack Reactor" />
        </a>
        <button className='btn btn-primary logout-button' onClick={this.logout.bind(this)} style={{display: this.state.user ? 'inline' : 'none'}}>Log out</button>
        {this.getLoginForm()}
        <span className='title'>pheed.</span>
      </div>
    );
  }
}

window.Header = Header;