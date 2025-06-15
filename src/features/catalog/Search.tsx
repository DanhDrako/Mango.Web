import { debounce, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import { setSearchTerm } from './catalogSlice';
import { useEffect, useState } from 'react';

export default function Search() {
  // Search component for filtering products in the catalog
  // Uses Redux to manage the search term state
  const { searchTerm } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  // Local state to manage the input value
  const [term, setTerm] = useState(searchTerm);

  // Effect to update local state when the search term changes in Redux
  useEffect(() => {
    setTerm(searchTerm);
  }, [searchTerm]);

  // Debounced function to handle search input changes
  const debouncedSearch = debounce((event) => {
    dispatch(setSearchTerm(event.target.value));
  }, 500);

  return (
    <TextField
      label="Search products"
      variant="outlined"
      fullWidth
      type="search"
      value={term}
      onChange={(e) => {
        // Update local state immediately for instant feedback
        // and dispatch the debounced action
        setTerm(e.target.value);
        debouncedSearch(e);
      }}
    />
  );
}
