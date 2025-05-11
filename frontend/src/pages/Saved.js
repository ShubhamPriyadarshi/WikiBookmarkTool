import { Container, Typography, Box } from '@mui/material';
import SavedArticleCard from '../components/SavedArticleCard';
import api from '../services/Api';
import { useState, useEffect } from 'react';

export default function Saved() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    api.get('/saved')
      .then(res => setSaved(res.data));
  }, []);

  return (
    <Container>
      {/* Adding space before the heading */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          mt: 6  // Adding top margin (room before the heading)
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          sx={{ fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}
        >
          Saved Articles
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Here are all the articles you've saved. You can delete them anytime.
        </Typography>
      </Box>

      {/* Rendering saved articles */}
      {[...saved].reverse().map(article => (
          <SavedArticleCard key={article.pageid} article={article} showDelete />
        ))}
    </Container>
  );
}
