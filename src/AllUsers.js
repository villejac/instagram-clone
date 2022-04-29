import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import './AllUsers.css';

function AllUsers({username}) {
// console.log(username)
  return (
    <div className='username__list'>
      <Avatar
        className='post__avatar'
        alt={username}
        src='/static/images/avatar/1.jpg'
        />
        <h3>{username}</h3>
    </div>
  )
}

export default AllUsers