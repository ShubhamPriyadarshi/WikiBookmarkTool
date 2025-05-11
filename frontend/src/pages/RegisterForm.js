import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/Api';
function RegisterForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  // Check if passwords match
  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  setLoading(true);
  try {
    // Make API call to register
    const res = await api.post(
      '/auth/register',
      { username, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Check if registration was successful
    const data = res.data;

    // If registration failed, throw an error (based on server response)
    if (data.detail) {
      throw new Error(data.detail);
    }

    // Clear form fields and navigate on success
    setUsername('');
    setPassword('');
    setConfirmPassword('');

    // Call onSuccess callback or navigate to login page
    if (onSuccess) onSuccess();
    else navigate('/login');

  } catch (err) {
    // Set error message from the error object
    setError(err.message);
  } finally {
    // Stop loading indicator
    setLoading(false);
  }
};


  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword && confirmPassword !== password}
            helperText={
              confirmPassword && confirmPassword !== password
                ? 'Passwords do not match'
                : ''
            }
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterForm;
