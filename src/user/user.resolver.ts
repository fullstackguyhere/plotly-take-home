import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, {name: 'user'})
  async user(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOne(id);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @ResolveField(() => [Product])
  order(@Parent() user: User) {
    return this.userService.findProducts(user.id);
  }

  @Mutation(() => User, {})
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  async addToOrder(
    @Args('userId') userId: string,
    @Args('productId') productId: string,
  ) {
    return this.userService.addToOrder(userId, productId);
  }
  
  
}
