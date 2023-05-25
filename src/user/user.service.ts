import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findOne(userId: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: userId }, relations: ["order"] });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  async findProducts(userId: string): Promise<Product[]> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ["order"] });
    return user.order;
  }

  async addToOrder(userId: string, productId: string): Promise<User> {
    const user = await this.findOne(userId);
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!user || !product) {
      throw new Error('User or product not found');
    }

    user.order = [...user.order, product];

    return this.userRepository.save(user);
  }
  
}
