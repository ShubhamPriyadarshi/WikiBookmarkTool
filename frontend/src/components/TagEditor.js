// components/TagEditor.js
import React, { useState } from 'react';
import { TextField, IconButton, Typography, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import api from '../services/Api';
export default function TagEditor({ initialTags = [], pageId }) {
  const [editing, setEditing] = useState(false);
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState(tags.join(', '));

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    const cleaned = inputValue
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const res = await api.post(
  '/saved/article/set-tags',
  { pageid: pageId, tags: cleaned },
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
);


      if (res.ok) {
        setTags(cleaned);
        setEditing(false);
      } else {
        console.error('Failed to update tags');
      }
    } catch (err) {
      console.error('Error while saving tags:', err);
    }
  };

  return (
   <Box sx={{ mt: 2, width: '100%' }}>
      {editing ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <TextField
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            label="Edit Tags"
            fullWidth
            multiline
            rows={3}
            sx={{
              '& .MuiInputBase-root': {
                overflow: 'auto',
                wordWrap: 'break-word',
                maxHeight: '150px',
              }
            }}
            variant="outlined"
          />
          <IconButton
            onClick={handleSaveClick}
            color="primary"
            sx={{ ml: 1, mt: 1 }}
          >
            <SaveIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Typography
            variant="body1"
            sx={{
              flexGrow: 1,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            <strong>Tags:</strong> {tags.join(', ')}
          </Typography>
          <IconButton
            onClick={handleEditClick}
            color="primary"
            sx={{ ml: 1 }}
          >
            <EditIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
