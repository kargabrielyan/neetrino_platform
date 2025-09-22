import { Test, TestingModule } from '@nestjs/testing';
import { DemosController } from './demos.controller';
import { DemosService } from './demos.service';
import { DemoState } from './demo.entity';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';

describe('DemosController', () => {
  let controller: DemosController;
  let service: DemosService;

  const mockDemosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    incrementViewCount: jest.fn(),
    checkAccessibility: jest.fn(),
    bulkOperation: jest.fn(),
    getStatsOverview: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemosController],
      providers: [
        {
          provide: DemosService,
          useValue: mockDemosService,
        },
      ],
    }).compile();

    controller = module.get<DemosController>(DemosController);
    service = module.get<DemosService>(DemosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new demo', async () => {
      const createDemoDto: CreateDemoDto = {
        name: 'Test Demo',
        url: 'https://example.com',
        vendorId: 'vendor-id',
      };

      const expectedDemo = {
        id: 'demo-id',
        ...createDemoDto,
        state: DemoState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDemosService.create.mockResolvedValue(expectedDemo);

      const result = await controller.create(createDemoDto);

      expect(service.create).toHaveBeenCalledWith(createDemoDto);
      expect(result).toEqual(expectedDemo);
    });
  });

  describe('findAll', () => {
    it('should return paginated demos with default parameters', async () => {
      const expectedResult = {
        data: [
          { id: '1', name: 'Demo 1' },
          { id: '2', name: 'Demo 2' },
        ],
        total: 2,
        page: 1,
        limit: 20,
      };

      mockDemosService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
        state: undefined,
        category: undefined,
        vendorId: undefined,
        search: undefined,
        sortBy: undefined,
        sortOrder: undefined,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should pass query parameters to service', async () => {
      const queryParams = {
        page: 2,
        limit: 10,
        state: DemoState.ACTIVE,
        category: 'business',
        vendorId: 'vendor-id',
        search: 'test',
        sortBy: 'name',
        sortOrder: 'ASC' as const,
      };

      mockDemosService.findAll.mockResolvedValue({ data: [], total: 0, page: 2, limit: 10 });

      await controller.findAll(
        queryParams.page,
        queryParams.limit,
        queryParams.state,
        queryParams.category,
        queryParams.vendorId,
        queryParams.search,
        queryParams.sortBy,
        queryParams.sortOrder,
      );

      expect(service.findAll).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('findOne', () => {
    it('should return a demo by id', async () => {
      const demoId = 'demo-id';
      const expectedDemo = {
        id: demoId,
        name: 'Test Demo',
        url: 'https://example.com',
      };

      mockDemosService.findOne.mockResolvedValue(expectedDemo);

      const result = await controller.findOne(demoId);

      expect(service.findOne).toHaveBeenCalledWith(demoId);
      expect(result).toEqual(expectedDemo);
    });
  });

  describe('update', () => {
    it('should update a demo', async () => {
      const demoId = 'demo-id';
      const updateDemoDto: UpdateDemoDto = {
        name: 'Updated Demo',
      };

      const expectedDemo = {
        id: demoId,
        name: 'Updated Demo',
        url: 'https://example.com',
      };

      mockDemosService.update.mockResolvedValue(expectedDemo);

      const result = await controller.update(demoId, updateDemoDto);

      expect(service.update).toHaveBeenCalledWith(demoId, updateDemoDto);
      expect(result).toEqual(expectedDemo);
    });
  });

  describe('remove', () => {
    it('should remove a demo', async () => {
      const demoId = 'demo-id';

      mockDemosService.remove.mockResolvedValue(undefined);

      await controller.remove(demoId);

      expect(service.remove).toHaveBeenCalledWith(demoId);
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count for a demo', async () => {
      const demoId = 'demo-id';

      mockDemosService.incrementViewCount.mockResolvedValue(undefined);

      await controller.incrementViewCount(demoId);

      expect(service.incrementViewCount).toHaveBeenCalledWith(demoId);
    });
  });

  describe('checkAccessibility', () => {
    it('should check accessibility for a demo', async () => {
      const demoId = 'demo-id';
      const expectedResult = {
        isAccessible: true,
        lastCheckedAt: new Date(),
      };

      mockDemosService.checkAccessibility.mockResolvedValue(expectedResult);

      const result = await controller.checkAccessibility(demoId);

      expect(service.checkAccessibility).toHaveBeenCalledWith(demoId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('bulkOperation', () => {
    it('should perform bulk operation on demos', async () => {
      const bulkRequest = {
        action: 'activate' as const,
        demoIds: ['demo-1', 'demo-2'],
      };

      const expectedResult = {
        updated: 2,
        errors: [],
      };

      mockDemosService.bulkOperation.mockResolvedValue(expectedResult);

      const result = await controller.bulkOperation(bulkRequest);

      expect(service.bulkOperation).toHaveBeenCalledWith('activate', ['demo-1', 'demo-2']);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getStatsOverview', () => {
    it('should return statistics overview', async () => {
      const expectedStats = {
        total: 100,
        active: 80,
        draft: 15,
        deleted: 5,
        byVendor: [
          { vendorName: 'Vendor 1', count: 50 },
          { vendorName: 'Vendor 2', count: 30 },
        ],
      };

      mockDemosService.getStatsOverview.mockResolvedValue(expectedStats);

      const result = await controller.getStatsOverview();

      expect(service.getStatsOverview).toHaveBeenCalled();
      expect(result).toEqual(expectedStats);
    });
  });
});
