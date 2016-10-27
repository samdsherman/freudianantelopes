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
    // get request to verify username/password combination
    this.setState({user: $('.login-form-username').val()});
  }

  signUp(e) {
    e.preventDefault();
    // post request to sign up new user
  }

  render() {
    return (
      <div className='header'>
        <button className='settings-button'>=</button>
        <span className='title'>Freudian Antelopes</span>
        {this.getLoginForm()}
      </div>
    );
  }
}

window.Header = Header;