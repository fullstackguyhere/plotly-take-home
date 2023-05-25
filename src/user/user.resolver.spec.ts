import { Test } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { CreateUserInput } from './dto/create-user.input';

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;

  const userArray = [
    {
      id: 'a1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 30,
      order: [],
    },
    {
      id: 'b2',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      age: 31,
      order: [],
    },
  ];

  const oneUser = userArray[0];

  const mockUserService = {
    findOne: jest.fn().mockResolvedValue(oneUser),
    findAll: jest.fn().mockResolvedValue(userArray),
    findProducts: jest.fn().mockResolvedValue(oneUser.order),
    create: jest.fn().mockResolvedValue(oneUser),
    addToOrder: jest.fn().mockResolvedValue(oneUser),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userResolver = moduleRef.get<UserResolver>(UserResolver);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
  });

  it('should find one user', async () => {
    const foundUser = await userResolver.user('a1');
    expect(foundUser).toEqual(oneUser);
  });

  it('should find all users', async () => {
    const users = await userResolver.findAll();
    expect(users).toEqual(userArray);
  });

  it('should resolve user products', async () => {
    const userProducts = await userResolver.order(oneUser);
    expect(userProducts).toEqual(oneUser.order);
  });

  it('should create a user', async () => {
    const userData: CreateUserInput = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 30,
    };

    const createdUser = await userResolver.createUser(userData);
    expect(createdUser.name).toEqual(userData.name);
    expect(createdUser.email).toEqual(userData.email);
    expect(createdUser.age).toEqual(userData.age);
  });

  it('should add to user order', async () => {
    const updatedUser = await userResolver.addToOrder('a1', 'd4');
    expect(updatedUser).toEqual(oneUser);
  });
});
