var Post = props => (
  <div className='post'>
    <img className='post-profile-pic' src={props.post.profilePic} />
    <a href={props.post.linkToPost} className='post-main'>
      <div className='post-header'>
        <span className='post-person-name'>{props.post.name}</span>
        <img className='post-service' src={'assets/' + props.post.service + '.png'} />
        <span className='post-timestamp'>{props.post.timeStampAgo}</span>
      </div>
      <div className='post-content'>{props.post.postContent}</div>
      <img classname='post-pic' src={props.post.postPic} />
    </a>
  </div>
);

window.Post = Post;