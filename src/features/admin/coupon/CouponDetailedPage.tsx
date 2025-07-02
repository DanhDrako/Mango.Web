import { useParams } from 'react-router';

export default function CouponDetail() {
  const { id } = useParams();

  // if (!id) return <div>Invalid coupon ID</div>;
  // const { data: order, isLoading } = useFetchOrderDetailsQuery(+id!);

  // if (isLoading)
  // 	return <Typography variant="h5">Loading order details...</Typography>;
  // if (!order) return <Typography variant="h5">Order not found</Typography>;

  return (
    <div>
      <h1>Coupon Detail Page</h1>
      <p>Details for coupon with ID: {id}</p>
      {/* Add more details about the coupon here */}
    </div>
  );
}
