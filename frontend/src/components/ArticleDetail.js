import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, CircularProgress, Typography, Box, Paper } from '@mui/material';
import SanitizedHTML from './SanitizedHTML';  // Adjust the path if needed
import api from './api';
const ArticleDetail = () => {
 const { pageid } = useParams();
  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    api.get(`/article/${pageid}`)
      .then((res) => {
        const { content } = res.data;
        setArticle({ ...res.data, content });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        setLoading(false);
      });
  }, [pageid]);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

   if (!article) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh'
      }}>
        <Typography variant="h5" align="center" gutterBottom>
          Article not found.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The requested article could not be located.
        </Typography>
      </Box>
    );
  }

  return (
//    <Container maxWidth="md" sx={{ py: 4 }}>
//      <Paper elevation={3} sx={{ p: 3 }}>
//        <Typography variant="h4" gutterBottom>Article</Typography>
//        <SanitizedHTML html={article} />
//      </Paper>
//    </Container>
 <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
      }}>
        {/* Main Article Content */}
        <Paper
          elevation={3}
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 70%' },
            overflow: 'hidden',
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          {/* Article Header */}
          <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {title}
            </Typography>
          </Box>

          {/* Article Body */}
          <Box sx={{
            p: 3,
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              margin: '1rem auto',
              borderRadius: 1,
            },
            '& table': {
              width: 'auto',
              maxWidth: '100%',
              margin: '1rem auto',
              borderCollapse: 'collapse',
              '& th, & td': {
                padding: '0.5rem',
                border: '1px solid #ddd',
              },
            },
            '& p': {
              margin: '1rem 0',
              lineHeight: 1.7,
            },
            '& h2, & h3, & h4': {
              margin: '1.5rem 0 1rem',
            },
          }}>
            <SanitizedHTML html={article.content} />
          </Box>
        </Paper>
        </Box>
</Container>


  );
};

export default ArticleDetail;
