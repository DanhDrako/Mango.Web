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
import { useDeleteBrandMutation, useFetchBrandsQuery } from './brandApi';
import { useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import type { Brand } from '../../../app/models/product/filter/brand';
import BrandForm from './BrandForm';

export default function Brands() {
  const { data: brands, isLoading } = useFetchBrandsQuery();
  const [editMode, setEditMode] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [deleteBrand] = useDeleteBrandMutation();

  if (isLoading) return <Typography variant="h5">Loading brands...</Typography>;

  if (!brands?.isSuccess) return <Typography variant="h5">Error</Typography>;

  const listBrands: Brand[] = brands.result;

  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setEditMode(true);
  };

  const handleDeleteBrand = async (id: number) => {
    try {
      await deleteBrand(id);
    } catch (error) {
      console.log('Error deleting brand:', error);
    }
  };

  if (editMode) {
    return (
      <BrandForm
        setEditMode={setEditMode}
        brand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          Brands List
        </Typography>
        <Button
          onClick={() => {
            setSelectedBrand(null);
            setEditMode(true);
          }}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Create new brand
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">BrandId</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Command</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listBrands.map((brand) => (
              <TableRow
                key={brand.brandId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {brand.brandId}
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => handleSelectBrand(brand)}
                    startIcon={<Edit />}
                  />
                  <Button
                    onClick={() => handleDeleteBrand(brand.brandId)}
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
