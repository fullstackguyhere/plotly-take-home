import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Options } from '@nestjs/common';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<Product>;

  const productArray = [
    {
      id: 'a1',
      name: 'Product A',
      price: 100,
    },
    {
      id: 'b2',
      name: 'Product B',
      price: 200,
    },
  ];

  const oneProduct = productArray[0];

  const mockProductRepository = {
    findOne: jest.fn().mockImplementation(({ where: { id: productId }}) => Promise.resolve(productArray.find(product => product.id === productId))),
    find: jest.fn().mockImplementation(() => Promise.resolve(productArray)),
    save: jest.fn().mockImplementation((product: Product) => Promise.resolve(product)),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    productService = moduleRef.get<ProductService>(ProductService);
    productRepository = moduleRef.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should find one product', async () => {
    const foundProduct = await productService.findOne('a1');
    expect(foundProduct).toEqual(oneProduct);
  });

  it('should find all products', async () => {
    const products = await productService.findAll();
    expect(products).toEqual(productArray);
  });

  it('should create a product', async () => {
    const productData: Product = {
      id: 'c3',
      name: 'Product C',
      price: 300,
    };

    const createdProduct = await productService.create(productData);
    expect(createdProduct).toEqual(productData);
  });
});
