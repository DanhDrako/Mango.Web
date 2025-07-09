import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import type { PaymentSummary, ShippingAddress } from '../app/models/order';

export function currencyFormat(amount: number) {
  return '$' + (amount / 100).toFixed(2);
}

export function filterEmptyValues(values: object) {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) =>
        value !== '' &&
        value !== null &&
        value !== undefined &&
        value.length !== 0
    )
  );
}

export function formatAddressString(address: ShippingAddress): string {
  return `${address?.name}, ${address?.line1}, ${address?.city}, ${address?.state} ${address?.postal_code}, ${address?.country}`;
}

export function formatPaymentString(card: PaymentSummary): string {
  return `${card?.brand?.toUpperCase()}. **** **** **** ${card?.last4}, Exp: ${
    card?.exp_month
  }/${card?.exp_year}`;
}

export function handleApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldNames: Path<T>[]
) {
  const apiError = (error as { message: string }) || {};

  if (apiError.message && typeof apiError.message === 'string') {
    const errorArray = apiError.message.split(',');

    errorArray.forEach((e) => {
      const matchedField = fieldNames.find((fieldName) =>
        e.toLowerCase().includes(fieldName.toString().toLowerCase())
      );

      if (matchedField) setError(matchedField, { message: e.trim() });
    });
  }
}

export function findFilterName<
  T extends { categoryId?: number; brandId?: number }
>(
  items: T[],
  targetId: number,
  idKey: keyof T,
  nameKey: keyof T = 'name' as keyof T
): string {
  const found = items.find((item) => item[idKey] === targetId);
  return (found?.[nameKey] as string) ?? 'Unknown';
}

// More specific helper functions for common use cases
export function findCategoryName(
  categories: Array<{ categoryId: number; name: string }>,
  categoryId: number
): string {
  return (
    categories.find((cate) => cate.categoryId === categoryId)?.name ?? 'Unknown'
  );
}

export function findBrandName(
  brands: Array<{ brandId: number; name: string }>,
  brandId: number
): string {
  return brands.find((brand) => brand.brandId === brandId)?.name ?? 'Unknown';
}

// Helper to compare arrays (shallow compare by id and name)
export function isRowsEqual(
  a: { id: number; name: string }[],
  b: { id: number; name: string }[]
): boolean {
  if (a.length !== b.length) return false;
  // const sortFn = (x: { id: number }) => x.id;
  const aSorted = [...a].sort((x, y) => (x.id > y.id ? 1 : -1));
  const bSorted = [...b].sort((x, y) => (x.id > y.id ? 1 : -1));
  return aSorted.every(
    (row, idx) => row.id === bSorted[idx].id && row.name === bSorted[idx].name
  );
}
