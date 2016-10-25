var Post = props => (
  <div className='post'>
    <img className='post-profile-pic' src={props.post.profilePic} />
    <a href={props.post.linkToPost} className='post-main'>
      <div className='post-header'>
        <span className='post-person-name'>{props.post.name}</span>
        <span className='post-timestamp'>{props.post.timestamp}</span>
      </div>
      <div className='post-content'>{props.post.postContent}</div>
    </a>
  </div>
);

window.Post = Post;