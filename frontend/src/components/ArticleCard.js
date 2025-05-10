import { Card, CardContent, Typography, Stack, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../components/api';

export default function ArticleCard({ article, showDelete = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${article.pageid}`);  // Navigate to the article detail page
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      await api.post('http://localhost:8000/save', {
        page_id: article.pageid,
        title: article.title,
        snippet: article.snippet
      });
      console.log('Article saved successfully');
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await api.delete(`http://localhost:8000/saved/${article.pageid}`);
      console.log('Article deleted successfully');
      window.location.reload();  // Or use a callback to update parent state
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  return (
    <Card sx={{ mb: 2 }} onClick={handleClick}>
      <CardContent>
        <Typography variant="h6">{article.title}</Typography>
        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: article.snippet }} />
        <Typography variant="caption" color="text.secondary" mt={1}>
          Last Updated: {new Date(article.timestamp).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color={showDelete ? 'error' : 'primary'}
          onClick={showDelete ? handleDelete : handleSave}
        >
          {showDelete ? 'Delete' : 'Save'}
        </Button>
      </CardActions>
    </Card>
  );
}
