import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import './Likes.css';
import firebase from 'firebase/compat/app';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

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

function Likes({user, postId}) {

    const [likes, setLikes] = useState([]);
    const [like, setLike] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    // jos käyttäjänimi on tietokannassa niin asetetaan sen mukaan ^liken tila true tai false
    useEffect(() => {
        // tämä koodi suoritetaan ainakun käyttäjä vaihtuu.
        // asetetaan like true, koska se voi olla samassa sessiossa jäänyt edellisellä käyttäjällä falseksi
        setLike(true);
        if(firebase.auth().currentUser) {
            const jobskill_query = db.collection("posts").doc(postId).collection("likes").where('likedUsers','==',user.displayName);
            if(jobskill_query) {
                jobskill_query.get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        // jos kirjautuneen käyttäjän nimi on tykkäys collectionissa laitetaan like falseksi
                        // (liken false tai true siis määrittää lisätäänkö vai poistetaanko nimi like collectionista)
                        setLike(false);
                    });
                    });
            }
        }

      }, [firebase.auth().currentUser])

    useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("likes")
            .onSnapshot((snapshot) => {
                setLikes(snapshot.docs.map((doc) => ({
              id: doc.id,
              likedUsers: doc.data()
            }))) 
          });
        }
        
        return () => {
          unsubscribe();
        };
      }, [postId]);

    const handleClick = (id) => {
        
        setLike(!like);

        if(like === true) {
            db.collection("posts").doc(postId).collection("likes").add({
                likedUsers: user.displayName
              });

        }else {

            const jobskill_query = db.collection("posts").doc(postId).collection("likes").where('likedUsers','==',user.displayName);
            jobskill_query.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
            });
        }
    }

  return (
    <div>
        {/* <button className={like ? 'like__button' : 'liked'} onClick={handleClick}>Like</button> */}
        <div className='like__heart' onClick={handleClick}>
        <i className={like ? 'far fa-heart' : 'fas fa-heart'} />
        </div>
        <div>
            {
            likes.length > 0 && (
            <div className='likes__amount tooltip' onClick={() => setOpenModal(true)}>
            <p>
            <strong>{likes.length}</strong> likes
            </p>
            <span className="tooltiptext">Show users who liked this post</span>
            </div>
            )}
            <Modal
              open={openModal}
              onClose={() => setOpenModal(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              >
              <Box sx={style}>
                <center>
                  <img 
                    className='app__headerImage'
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png?20160616034027"
                    alt=""
                  />
                  {likes.map((like) => (
            <p key={like.id}>
                <strong>{like.likedUsers.likedUsers}</strong>
            </p>
            ))}
            </center>
          </Box>
      </Modal>

        </div>
    </div>
  )
}

export default Likes
