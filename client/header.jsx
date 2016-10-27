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
          Username: <input type='text' name='username' /><br/>
          Password: <input type='password' name='password' /><br/>
          <button type='submit'>Submit</button>
        </form>
      );
    }
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