var App = props => (
  <div className='app'>
    <div className='app-sidebar'>
      <Sidebar groups={['Warriors', 'Lakers', 'Trolls']} />
    </div>
    <div className='app-feed'>
      <Feed posts={[1, 2, 3]} />
    </div>
  </div>
);




ReactDOM.render(<App />, document.getElementById('app'));