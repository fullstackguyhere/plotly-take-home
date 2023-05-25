import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product]), ProductModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}

