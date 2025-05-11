import { Card, CardContent, Typography, Stack, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/Api';

export default function SavedArticleCard({ article }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the saved article detail page (different route)
    navigate(`/saved/page/${article.page_id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent the card click from triggering

    try {
      await api.delete(`/saved/article/${article.page_id}`);
      console.log('Article deleted successfully');
      window.location.reload(); // Refresh the page or use a state update method to remove it from the UI
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  return (
    <Card sx={{ mb: 2 }} onClick={handleClick}>
      <CardContent>
        <Typography variant="h6">{article.title}</Typography>
        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: article.snippet }} />
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
