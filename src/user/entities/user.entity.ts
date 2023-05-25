import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../../product/entities/product.entity';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  age: number;

  @ManyToMany(() => Product)
  @JoinTable()
  order: Product[];
}
