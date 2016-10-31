var Post = props => (
  <div className='post-container post'>
    <div className='prof-pic'>
      <img className='img-circle' height='50' width='50' alt='Cinque Terre' src={props.post.profilePic} />
    </div>
    <div className='post-content' id='talkbubble'>
      <div className='panel panel-info'>
          <a className='post-link' href={props.post.linkToPost} target="_blank">
            <div className='panel-heading'>
                
              <span className='post-groupmember-name'>{props.post.name}</span>
              <img className='post-service' src={'assets/' + props.post.service + '.png'} />
              <span className='post-timestamp'>{props.post.timeStampAgo}</span>
                
            </div>
            <div className='panel-body'>
              <div>{props.post.postContent}</div>
              <img src={props.post.postPic} height='50%' width='50%' />
            </div>
          </a>
      </div>
    </div>
  </div>
);

window.Post = Post;