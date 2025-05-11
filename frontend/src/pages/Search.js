import { useState } from 'react';
import axios from 'axios';
import { TextField, Container } from '@mui/material';
import ArticleCard from '../components/ArticleCard';
import { useAuth } from '../components/AuthContext';
import api from '../services/Api';
export default function Search() {
  const { logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await api.get(`/wiki/search?query=${query}`);
    setResults(res.data || []);  // depends on your backend shape
  };

  return (
    <Container>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Search Wikipedia"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      {results.map(article => (
        <ArticleCard key={article.pageid} article={article} />
      ))}
    </Container>
  );
}
