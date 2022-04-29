import * as React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';
import ImageUpload from './ImageUpload';
import AllUsers from './AllUsers';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);

      } else {
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user]);


  useEffect(() => {
       db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
       setPosts(snapshot.docs.map(doc => ({
         id: doc.id,
         post: doc.data()
        })));
      })
   }, []);

   // käyttäjänimet
    useEffect(() => {
     db.collection('usernames').onSnapshot(snapshot => {
     setUserList(snapshot.docs.map(doc => ({
       id: doc.id,
       uName: doc.data()
      })));
    })
 }, []);

  
  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
        
     db.collection("usernames").add({
      uName: username
    });

      return authUser.user.updateProfile({
        displayName: username
      })
      
    })
    .catch((error) => alert(error.message));

    setOpen(false);


  }


  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app">
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
          <Box sx={style}>
            <form className='app__signup'>
            <center>
              <img 
                className='app__headerImage'
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png?20160616034027"
                alt=""
              />
            </center>
              <Input
                placeholder='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder='email'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              { <Button type='submit' onClick={signUp}>Sign Up</Button> } 
            </form>
          </Box>
      </Modal>

      <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
          <Box sx={style}>
            <form className='app__signup'>
            <center>
              <img 
                className='app__headerImage'
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png?20160616034027"
                alt=""
              />
            </center>
              <Input
                placeholder='email'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              { <Button type='submit' onClick={signIn}>Sign In</Button> } 
            </form>
          </Box>
      </Modal>

      <div className='app__header'>
        <img 
          className='app__headerImage'
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png?20160616034027"
          alt=""
        />

        {!user &&  (
          <div className='notification__container'>
          <p className='login__notification'><strong>Login or sign up to get more out of this app</strong></p>
          </div>
        )}

        {user ? (
        <Button onClick={() => auth.signOut()}>LogOut {user.displayName}</Button>
        ): (
        <div className='app__loginContainer'>
          
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={handleOpen}>Sign Up</Button>

        </div>
      )}
      </div>
        
      <div className='container'>
      <div className='postsbox'>
      <div className='app__posts'>
      {
        posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageURL={post.imageUrl} />
        ))
      }
      </div>
      
      {/* {user ?  (
        <ImageUpload username={user.displayName} />
      ):(
        <h3 className='login__info'>You need to login to upload</h3>
      )} */}
    </div>
    <div className='post__users__box'>
    {user &&  (
        <div><h2 className='users__heading'>Make a post</h2>
        <ImageUpload username={user.displayName} />
        </div>
      )}
      {
        user &&  (
          <h3 className='users__heading'>Some fellas using this app</h3>
        )
      }  
      
      {
      user &&  (
        userList.map(({id, uName}) => (
          <AllUsers key={id} username={uName.uName} />
        ))
      )}

    </div>
    </div>
    </div>
  );
}

export default App;


// Jos käyttäjälista toimii niin pidetään se
// Lisätään vielä kommentoiduin kuva käyttäjälistan päälle
// Jos edellämainittu ei onnistu niin kuvan lisäys-osio sen tilalle
