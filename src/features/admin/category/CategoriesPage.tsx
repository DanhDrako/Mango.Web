import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  TableContainer
} from '@mui/material';
import {
  useDeleteCategoryMutation,
  useFetchCategoriesQuery
} from './categoryApi';
import { useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import type { Category } from '../../../app/models/product/filter/category';
import CategoryForm from './CategoryForm';

export default function Categories() {
  const { data: categories, isLoading } = useFetchCategoriesQuery();
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [deleteCoupon] = useDeleteCategoryMutation();

  if (isLoading)
    return <Typography variant="h5">Loading categories...</Typography>;

  if (!categories?.isSuccess)
    return <Typography variant="h5">Error</Typography>;

  const listCategories: Category[] = categories.result;

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditMode(true);
  };

  const handleDeleteCoupon = async (id: number) => {
    try {
      await deleteCoupon(id);
    } catch (error) {
      console.log('Error deleting category:', error);
    }
  };

  if (editMode) {
    return (
      <CategoryForm
        setEditMode={setEditMode}
        category={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          Categories List
        </Typography>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setEditMode(true);
          }}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Create new category
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">CategoryId</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Command</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listCategories.map((category) => (
              <TableRow
                key={category.categoryId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {category.categoryId}
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => handleSelectCategory(category)}
                    startIcon={<Edit />}
                  />
                  <Button
                    onClick={() => handleDeleteCoupon(category.categoryId)}
                    startIcon={<Delete />}
                    color="error"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
