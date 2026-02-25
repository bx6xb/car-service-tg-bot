import { $api } from '../config';
import { Product } from './types';

export class ProductsApi {
  static async getProductById(id: string | number): Promise<Product> {
    const { data } = await $api.get('/products', { params: { id } });
    return data.data.find((p: Product) => p.id === Number(id));
  }
}
