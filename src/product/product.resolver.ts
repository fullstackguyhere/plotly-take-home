import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Resolver(of => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => Product, {name: 'product'})
  async product(@Args('id', { type: () => String }) id: string) {
    return this.productService.findOne(id);
  }

  @Query(returns => [Product])
  async products() {
    return this.productService.findAll();
  }

  @Mutation(returns => Product)
  async createProduct(
    @Args('name') name: string,
    @Args('price') price: number,
  ) {
    const product = new Product();
    product.name = name;
    product.price = price;

    return this.productService.create(product);
  }
}
