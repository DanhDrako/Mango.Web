import { useFetchOrderByUserIdQuery } from '../../features/order/orderApi';
import { useInfo } from './useInfo';

export const useOrder = (status: number) => {
  const { userDto } = useInfo();

  const { data: responseOrder, isLoading } = useFetchOrderByUserIdQuery({
    id: userDto?.id ?? '',
    status
  });

  if (!responseOrder?.isSuccess || !responseOrder?.result) {
    return {
      result: null,
      isLoading
    };
  }

  return {
    result: responseOrder.result,
    isLoading
  };
};
