var Header = (props) => (
  <div className='header'>
    <button className='settings-button'>=</button>
    <span className='title'>Freudian Antelopes</span>
    <form className='login-form'>
      Username: <input type='text' name='username' /><br/>
      Password: <input type='password' name='password' /><br/>
      <button type='submit'>Submit</button>
    </form>
  </div>
);

window.Header = Header;