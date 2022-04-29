import React, { useEffect, useState } from 'react';
import './Post.css';
import { Avatar } from '@mui/material';
import { db } from './firebase';
import firebase from 'firebase/compat/app';
import Likes from './Likes';

function Post({ postId, user, username, caption, imageURL }) {

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => ({
          id: doc.id,
          comment: doc.data()
        }))) 
      });
    }
    
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  }

  const deleteComment = (id) => { 
    db.collection("posts").doc(postId).collection("comments").doc(id).delete();
  }

  return (
    <div className='post'>
        <div className='post__header'>
            <Avatar
                className='post__avatar'
                alt={username}
                src='/static/images/avatar/1.jpg'
            />
            <h3>{username}</h3>
        </div>

        <img 
            className='post__image' src={imageURL} alt=''
        />

        {user &&  (
          <Likes postId={postId} user={user} />
        )}
        

        <h4 className='post__text'><strong>{username}</strong> {caption}</h4>

        <div className='post__comments'>
          {comments.map((comment) => (
          <p key={comment.id}>
            <strong>{comment.comment.username}</strong> {comment.comment.text}
            
            {user?.displayName === comment.comment.username &&  (
              <button onClick={() => deleteComment(comment.id)} className='delete__comment__button'>x</button>
            )}
            
          </p>
          ))}
        </div>
        
        {user && ( 
          <form className='post__commentBox'>
            <input
              className='post__input'
              type='text'
              placeholder='Add a comment...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              >
            </input>
            <button
              className='post__button'
              disabled={!comment}
              type='submit'
              onClick={postComment}
              >
                Post
            </button>
        </form>
        )}
        

    </div>
  )
}

export default Post