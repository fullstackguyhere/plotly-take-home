import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Product } from '../product/entities/product.entity';
import { CreateUserInput } from './dto/create-user.input';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;

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

  const mockUserRepository = {
    findOne: jest.fn().mockImplementation((options: any) => Promise.resolve(userArray.find(user => user.id === options.where.id))),
    find: jest.fn().mockImplementation(() => Promise.resolve(userArray)),
    create: jest.fn().mockImplementation((userData: CreateUserInput) => Promise.resolve({ id: 'c3', ...userData, order: [] })),
    save: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
  };

  const mockProductRepository = {
    findOne: jest.fn().mockImplementation(({ where: { id: productId }}) => Promise.resolve({ id: productId, name: 'Sample Product', description: 'A product for testing.' })),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    productRepository = moduleRef.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should find one user', async () => {
    const foundUser = await userService.findOne('a1');
    expect(foundUser).toEqual(oneUser);
  });

  it('should find all users', async () => {
    const users = await userService.findAll();
    expect(users).toEqual(userArray);
  });

  it('should create a user', async () => {
    const userData: CreateUserInput = {
      name: 'Alice',
      email: 'alice@example.com',
      age: 25,
    };

    const createdUser = await userService.create(userData);
    expect(createdUser).toEqual({ id: 'c3', ...userData, order: [] });
  });

  it('should find user products', async () => {
    const userProducts = await userService.findProducts('a1');
    expect(userProducts).toEqual(oneUser.order);
  });

  it('should add to user order', async () => {
    const updatedUser = await userService.addToOrder('a1', 'd4');
    const expectedProduct = { id: 'd4', name: 'Sample Product', description: 'A product for testing.' };
    expect(updatedUser.order).toContainEqual(expectedProduct);
  });
});
