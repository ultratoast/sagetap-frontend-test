 /* eslint-disable */

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Input from '@mui/material/Input';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

const SUBMISSION_FAILURE = 'There has been an error, please try again';

async function getArtwork(id: number) {
  return fetch(`https://api.artic.edu/api/v1/artworks/${id}`)
    .then((response: any) => response.json())
    .then((response:any) => 
      response.data
    )
    .catch((error:any) =>
      []
    )
}

async function getImageUrl(id: string) {
  return fetch(`https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`)
    .then((response:any) => response.blob())
    .then((blob:any) =>
      URL.createObjectURL(blob)
    )
    .catch((error:any) => 
      ''
    );
}

async function submitRating(id: string, rating: number) {
  return fetch(
    'https://v0867.mocklab.io/rating',
    { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        rating
      })
    })
    .then((response: any) => response.json())
    .then((response: any) => 
      response.message
    )
    .catch((error: any) => 
      SUBMISSION_FAILURE
    );
}


function ArtItem(props: any) {
  const [voted, setVoted] = useState<boolean>(false);
  const [artwork, setArtwork] = useState<any>(null);
  const [rating, setRating] = useState<any>(null);
  const [artworkImage, setArtworkImage] = useState<any>(null);
  const [message, setMessage] = useState<any>(null);

  if (props.disabled)
  {
    return <></>;
  }
  
  const handleSubmit = (id: string, rating: number) => {
    submitRating(id, rating)
    .then((response: any) =>
        setMessage(response)
      );
  };

  const handleVote = (rg: number) => {
    setRating(rg)
    setVoted(true);
  };

  const handleCloseToast = () => {
    setMessage(null);
  }
 
  useEffect(() => {
    if (!artwork || artwork.id !== props.id) {
      getArtwork(props.id)
        .then((response: any) =>
          setArtwork(response)
        );
    }
  }, [artwork]);
 
  useEffect(() => {
    if ((artwork && !artworkImage) || (artwork && artwork.id !== props.id)) {
      getImageUrl(artwork.image_id)
        .then((response: any) => 
          setArtworkImage(response)
        );
    }
  }, [artworkImage]);
  
  const ratings = [1, 2, 3, 4, 5];
  
  return (
    <div className="artwork-item" id={`artwork-${props.id}`}>
      <h2>{artwork && artwork.title ? artwork.title : 'untitled'}</h2>
      <h3>{artwork && artwork.artist_title ? artwork.artist_title : 'anonymous'}</h3>
      {
        artwork && artworkImage ? 
        <img style={ { width: '66%' } } src={artworkImage} /> : 
        <strong className="loading-spinner">Image loading</strong>
      }
      <p>Rating: {rating ? rating : 'not yet rated'}</p>
      {ratings.map((rg:number) =>
        <Button onClick={() => { handleVote(rg) }}>{rg}</Button>
      )}
      <Button disabled={!voted} onClick={() => {handleSubmit(artwork.id, rating)}}>Submit</Button>
      {voted && message && <Popper sx={{left: 'calc(50% - 100px) !important', top: 'calc(50% - 30px) !important'}} open={true} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Button onClick={handleCloseToast} className="close-toast">X</Button>
              <Typography sx={{ p: 2 }}>{message}</Typography>
            </Paper>
          </Fade>
        )}
      </Popper>}
    </div>
  )
}

function App() {
  const [arts, setArts] = useState<any>([])
  const [artInput, setArtInput] = useState<any>("");

  const handleRemoveArtwork = (id: string) => {
    const filteredarts = arts.filter((art: any) => art.id !== id);
    setArts(filteredarts);
  };

  const handleInputChange = (event: any) => {
    setArtInput(event.target.value);
  };

  const handleAddArtwork = (event: any) => {
    event.preventDefault();
    const newart = { id: artInput, disabled: false }
    setArts((prevState: any) => [...prevState,newart]);
  }
   
  const newarts = [
    { id: '27992', disabled: false },
    { id: '27998', disabled: false },
    { id: '27999', disabled: false },
    { id: '27997', disabled: false },
    { id: '27993', disabled: false },
  ];
  useEffect(() => {
    if (!arts.length) {
      setArts(newarts);
    }
  });
  return (
    <Container maxWidth="lg">
      <h1>Art Rater</h1>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
        {arts && arts.map((item: any) =>
          <Grid item xs={12}>
            <ArtItem id={item.id} disabled={item.disabled} />
            <Button color="error" onClick={() => {handleRemoveArtwork(item.id)}}>Remove Art</Button>
          </Grid>
        )}
        <div>
          <Input placeholder="Artwork id" type="text" name="id" onChange={handleInputChange}/>
          <Button onClick={handleAddArtwork}>Add art</Button>
        </div>
      </Grid>
    </Container>
  );
}

export {App, ArtItem};
