import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DemosService } from './demos.service';
import { Demo, DemoState } from './demo.entity';
import { CreateDemoDto } from './dto/create-demo.dto';

describe('DemosService', () => {
  let service: DemosService;
  let repository: Repository<Demo>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    count: jest.fn(),
    increment: jest.fn(),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getRawMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DemosService,
        {
          provide: getRepositoryToken(Demo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DemosService>(DemosService);
    repository = module.get<Repository<Demo>>(getRepositoryToken(Demo));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new demo successfully', async () => {
      const createDemoDto: CreateDemoDto = {
        name: 'Test Demo',
        url: 'https://example.com',
        vendorId: 'vendor-id',
      };

      const expectedDemo = {
        id: 'demo-id',
        ...createDemoDto,
        urlCanonical: 'https://example.com/',
        firstSeenAt: expect.any(Date),
        lastSeenAt: expect.any(Date),
        state: DemoState.ACTIVE,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(expectedDemo);
      mockRepository.save.mockResolvedValue(expectedDemo);

      const result = await service.create(createDemoDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { urlCanonical: 'https://example.com/' },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDemoDto,
        urlCanonical: 'https://example.com/',
        firstSeenAt: expect.any(Date),
        lastSeenAt: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedDemo);
      expect(result).toEqual(expectedDemo);
    });

    it('should throw BadRequestException if demo with same URL already exists', async () => {
      const createDemoDto: CreateDemoDto = {
        name: 'Test Demo',
        url: 'https://example.com',
        vendorId: 'vendor-id',
      };

      const existingDemo = { id: 'existing-id', urlCanonical: 'https://example.com/' };
      mockRepository.findOne.mockResolvedValue(existingDemo);

      await expect(service.create(createDemoDto)).rejects.toThrow(
        new BadRequestException('Demo with this URL already exists'),
      );
    });
  });

  describe('findOne', () => {
    it('should return a demo by id', async () => {
      const demoId = 'demo-id';
      const expectedDemo = {
        id: demoId,
        name: 'Test Demo',
        url: 'https://example.com',
        vendor: { id: 'vendor-id', name: 'Test Vendor' },
      };

      mockRepository.findOne.mockResolvedValue(expectedDemo);

      const result = await service.findOne(demoId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: demoId },
        relations: ['vendor'],
      });
      expect(result).toEqual(expectedDemo);
    });

    it('should throw NotFoundException if demo not found', async () => {
      const demoId = 'non-existent-id';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(demoId)).rejects.toThrow(
        new NotFoundException(`Demo with ID ${demoId} not found`),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated demos with default options', async () => {
      const demos = [
        { id: '1', name: 'Demo 1' },
        { id: '2', name: 'Demo 2' },
      ];
      const total = 2;

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([demos, total]);

      const result = await service.findAll();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('demo');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('demo.vendor', 'vendor');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('demo.state != :deleted', { deleted: DemoState.DELETED });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('demo.createdAt', 'DESC');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
      expect(result).toEqual({
        data: demos,
        total,
        page: 1,
        limit: 20,
      });
    });

    it('should apply filters correctly', async () => {
      const options = {
        page: 2,
        limit: 10,
        state: DemoState.ACTIVE,
        category: 'business',
        vendorId: 'vendor-id',
        search: 'test',
        sortBy: 'name',
        sortOrder: 'ASC' as const,
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll(options);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('demo.state = :state', { state: DemoState.ACTIVE });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('demo.category = :category', { category: 'business' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('demo.vendorId = :vendorId', { vendorId: 'vendor-id' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(demo.name ILIKE :search OR demo.url ILIKE :search OR demo.description ILIKE :search)',
        { search: '%test%' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('demo.name', 'ASC');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  describe('bulkOperation', () => {
    it('should perform bulk activate operation', async () => {
      const demoIds = ['demo-1', 'demo-2'];
      const demos = [
        { id: 'demo-1', state: DemoState.DRAFT },
        { id: 'demo-2', state: DemoState.DRAFT },
      ];

      mockRepository.findOne
        .mockResolvedValueOnce(demos[0])
        .mockResolvedValueOnce(demos[1]);
      mockRepository.save.mockResolvedValue({});

      const result = await service.bulkOperation('activate', demoIds);

      expect(result.updated).toBe(2);
      expect(result.errors).toHaveLength(0);
      expect(mockRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should handle errors in bulk operation', async () => {
      const demoIds = ['demo-1', 'non-existent'];
      const demo = { id: 'demo-1', state: DemoState.DRAFT };

      mockRepository.findOne
        .mockResolvedValueOnce(demo)
        .mockResolvedValueOnce(null);
      mockRepository.save.mockResolvedValue({});

      const result = await service.bulkOperation('activate', demoIds);

      expect(result.updated).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Demo with ID non-existent not found');
    });
  });
});
