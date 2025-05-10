import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  CircularProgress,
  Typography,
  Box,
  Paper,
  Chip,
  TextField,
  IconButton,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LabelIcon from '@mui/icons-material/Label';
import SanitizedHTML from './SanitizedHTML';
import api from './api';

const ArticleDetail = () => {
  const { pageid } = useParams();
  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState(null);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingTags, setEditingTags] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/saved-article/${pageid}`)
      .then((res) => {
        const { content, tags, title } = res.data;
        setArticle({ ...res.data, content });
        setTitle(title);
        setTags(tags ? tags.split(',').map(t => t.trim()) : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        setLoading(false);
      });
  }, [pageid]);

  const handleEditTags = () => {
    setInputValue(tags.join(', '));
    setEditingTags(true);
  };

  const handleSaveTags = async () => {
    const cleaned = inputValue
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .join(', ');

    try {
      await api.post('/set-tags', {
        pageid,
        tags: cleaned,
      });
      setTags(cleaned.split(',').map(t => t.trim()));
      setEditingTags(false);
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  };

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

        {/* Sidebar */}
        <Box sx={{
          flex: { xs: '1 1 100%', md: '1 1 30%' },
          position: 'relative',
        }}>
          <Card
            elevation={3}
            sx={{
              position: { md: 'sticky' },
              top: { md: '2rem' },
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {/* Tags Header */}
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <LabelIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Tags
              </Typography>
              {!editingTags && (
                <IconButton
                  onClick={handleEditTags}
                  size="small"
                  sx={{ ml: 'auto', color: 'primary.contrastText' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <CardContent>
              {editingTags ? (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Enter tags separated by commas"
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 1.5,
                      }
                    }}
                  />
                  <IconButton
                    onClick={handleSaveTags}
                    color="primary"
                    sx={{ ml: 1, mt: 1 }}
                  >
                    <SaveIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    p: 1,
                    minHeight: '50px',
                  }}
                >
                  {tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        color="primary"
                        size="medium"
                        sx={{
                          borderRadius: '16px',
                          fontWeight: 500,
                          '& .MuiChip-label': { px: 1.5 }
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                      No tags yet. Click the edit icon to add some tags.
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Additional information card - optional */}
          <Card
            elevation={3}
            sx={{
              mt: 3,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <BookmarkIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Article Info
              </Typography>
            </Box>
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                Wikipedia Page ID: {pageid}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                This article has been saved to your personal collection.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default ArticleDetail;