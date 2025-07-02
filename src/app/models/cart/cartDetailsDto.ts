import type { ProductDto } from '../product/productDto';
import type { CartHeaderDto } from './cartHeaderDto';

export interface CartDetailsDto {
  cartDetailsId?: number;
  cartHeaderId?: number;
  cartHeader?: CartHeaderDto;
  productId: number;
  product?: ProductDto;
  quantity: number;
}

// export type Basket = {
//   basketId: string;
//   items: Item[];
//   clientSecret?: string;
//   paymentIntentId?: string;
// };

// export class Item {
//   constructor(product: Product, quantity: number) {
//     this.productId = product.productId;
//     this.name = product.name;
//     this.price = product.price;
//     this.imageUrl = product.imageUrl;
//     this.brand = product.brand;
//     this.type = product.type;
//     this.quantity = quantity;
//   }

//   productId: number;
//   name: string;
//   price: number;
//   imageUrl: string;
//   brand: string;
//   type: string;
//   quantity: number;
// }
