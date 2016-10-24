var Feed = props => (
  <div className='feed'>
    <div className='feed-header'>{props.group}</div>
    <div className='feed-posts'>
      {props.posts.map(post => <Post post={post} />)}
    </div>
  </div>
);

window.Feed = Feed;