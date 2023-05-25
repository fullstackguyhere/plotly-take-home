import { Test } from '@nestjs/testing';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

describe('ProductResolver', () => {
  let productResolver: ProductResolver;
  let productService: ProductService;

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

  const mockProductService = {
    findOne: jest.fn().mockResolvedValue(oneProduct),
    findAll: jest.fn().mockResolvedValue(productArray),
    create: jest.fn().mockResolvedValue(oneProduct),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductResolver,
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    productResolver = moduleRef.get<ProductResolver>(ProductResolver);
    productService = moduleRef.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productResolver).toBeDefined();
  });

  it('should find one product', async () => {
    const foundProduct = await productResolver.product('a1');
    expect(foundProduct).toEqual(oneProduct);
  });

  it('should find all products', async () => {
    const products = await productResolver.products();
    expect(products).toEqual(productArray);
  });

  it('should create a product', async () => {
    const productData = {
      name: 'Product A',
      price: 100
    };

    const createdProduct = await productResolver.createProduct(productData.name, productData.price);
    expect(createdProduct).toEqual(oneProduct);
  });
});
