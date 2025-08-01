import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { useFetchProductsQuery } from '../../catalog/catalogApi';
import {
  currencyFormat,
  findBrandName,
  findCategoryName
} from '../../../lib/util';
import { Delete, Edit } from '@mui/icons-material';
import AppPagination from '../../../app/shared/components/AppPagination';
import { setPageNumber } from '../../catalog/catalogSlice';
import ProductForm from './ProductForm';
import { useState } from 'react';
import type { ProductDto } from '../../../app/models/product/productDto';
import { useDeleteProductMutation } from './productApi';
import { useProduct } from '../../../lib/hook/useProduct';

export default function InventoryPage() {
  const productParams = useAppSelector((state) => state.catalog);
  const { data, refetch } = useFetchProductsQuery(productParams);
  const { filters } = useProduct();
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(
    null
  );
  const [deleteProduct] = useDeleteProductMutation();

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setEditMode(true);
  };
  const handleSelectProduct = (product: ProductDto) => {
    setSelectedProduct(product);
    setEditMode(true);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      refetch();
    } catch (error) {
      console.log('Error deleting product:', error);
    }
  };

  if (
    !data ||
    !data.response.isSuccess ||
    !data.pagination ||
    !filters?.brands ||
    !filters?.categories
  ) {
    return <Typography variant="h5">No products available</Typography>;
  }

  const { response, pagination } = data;

  if (editMode)
    return (
      <ProductForm
        setEditMode={setEditMode}
        product={selectedProduct}
        refetch={refetch}
        setSelectedProduct={setSelectedProduct}
      />
    );
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          Inventory Page
        </Typography>
        <Button
          onClick={handleCreateProduct}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Create
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Brand</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Command</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.result.map((product) => (
              <TableRow
                key={product.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {product.productId}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{product.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {currencyFormat(product.price)}
                </TableCell>
                <TableCell align="center">
                  {findCategoryName(filters.categories, product.categoryId)}
                </TableCell>
                <TableCell align="center">
                  {findBrandName(filters.brands, product.brandId)}
                </TableCell>
                <TableCell align="center">{product.quantityInStock}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => handleSelectProduct(product)}
                    startIcon={<Edit />}
                  />
                  <Button
                    onClick={() => handleDeleteProduct(product.productId)}
                    startIcon={<Delete />}
                    color="error"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ p: 3 }}>
          {pagination && (
            <AppPagination
              metadata={pagination}
              onPageChange={(page: number) => dispatch(setPageNumber(page))}
            />
          )}
        </Box>
      </TableContainer>
    </>
  );
}
