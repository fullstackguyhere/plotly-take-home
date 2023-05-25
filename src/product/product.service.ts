import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findOne(productId: string): Promise<Product> {
    return await this.productRepository.findOne({ where: { id: productId } });
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async create(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }
}
