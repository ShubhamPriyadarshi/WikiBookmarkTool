import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, CircularProgress, Typography, Box, Paper } from '@mui/material';
import SanitizedHTML from './SanitizedHTML';  // Adjust the path if needed
import api from './api';
const ArticleDetail = () => {
  const { pageid } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`http://localhost:8000/article/${pageid}`)
      .then((res) => {
        setArticle(res.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        setLoading(false);
      });
  }, [pageid]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center-', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!article) {
    return <Typography variant="h6" align="center">Article not found.</Typography>;
  }

  return (
//    <Container maxWidth="md" sx={{ py: 4 }}>
//      <Paper elevation={3} sx={{ p: 3 }}>
//        <Typography variant="h4" gutterBottom>Article</Typography>
//        <SanitizedHTML html={article} />
//      </Paper>
//    </Container>
<Container
  maxWidth="md"
  sx={{
    py: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  }}
>
  <Paper
    elevation={3}
    sx={{
      p: 3,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // center children like title
      textAlign: 'justify',  // center all text
    }}
  >


    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'justify',
        '& img': {
          margin: '0 auto',
        },
        '& table': {
          margin: '0 auto',
        },
      }}
    >
      <SanitizedHTML html={article} />
    </Box>
  </Paper>
</Container>


  );
};

export default ArticleDetail;
