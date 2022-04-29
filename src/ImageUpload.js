import { Button } from '@mui/material';
import React, { useState } from 'react';
import { storage, db } from './firebase';
import firebase from 'firebase/compat/app';
import './ImageUpload.css'


function ImageUpload({username}) {

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                // progress animaatio
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // error function...
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function...
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {

                    // post image inside db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username
                    });

                    setProgress(0);
                    setCaption('');
                    setImage(null);

                });
            }
        );
    };
    
  return (
    <div className='imageupload'>
        <progress className='imageupload__progress' value={progress} max="100"></progress>
        <input className='image__caption' type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}></input>
        { <input type="file" onChange={handleChange}></input> }
        <Button onClick={handleUpload}>
            Upload
        </Button>
    </div>
  )
}

export default ImageUpload