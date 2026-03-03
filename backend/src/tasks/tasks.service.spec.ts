import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from './prisma.service';

const mockPrismaService = {
  column: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  task: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(mockPrismaService)),
};

describe('TasksService', () => {
  let service: TasksService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBoard', () => {
    it('should return columns with tasks ordered properly', async () => {
      const mockBoard = [
        { id: 'col1', name: 'To Do', order: 0, tasks: [] },
        { id: 'col2', name: 'Done', order: 1, tasks: [] },
      ];
      prisma.column.findMany.mockResolvedValue(mockBoard);

      const result = await service.getBoard();

      expect(result).toEqual(mockBoard);
      expect(prisma.column.findMany).toHaveBeenCalledWith({
        include: { tasks: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
      });
    });
  });

  describe('createTask', () => {
    it('should create a task at the end of the column (order 0 if empty)', async () => {
      // Cenário: Coluna vazia
      prisma.task.findFirst.mockResolvedValue(null);
      prisma.task.create.mockResolvedValue({ id: 'task1', text: 'New Task', order: 0, columnId: 'col1' });

      await service.createTask('New Task', 'col1');

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { text: 'New Task', columnId: 'col1', order: 0 },
      });
    });

    it('should create a task incrementing the order', async () => {
      // Cenário: Coluna já tem tarefa com ordem 5
      prisma.task.findFirst.mockResolvedValue({ id: 'taskOld', order: 5 });
      
      await service.createTask('New Task', 'col1');

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { text: 'New Task', columnId: 'col1', order: 6 }, // 5 + 1
      });
    });
  });

  describe('updateTaskPosition', () => {
    // Este é o teste mais importante para a entrevista!
    it('should reorder tasks within the same column', async () => {
      const mockTask = { id: 'task1', columnId: 'col1', order: 0 }; // Estava na posição 0
      prisma.task.findUnique.mockResolvedValue(mockTask);

      // Movendo da posição 0 para 2 na mesma coluna
      await service.updateTaskPosition('task1', 'col1', 2);

      // Deve decrementar quem estava no caminho (entre 0 e 2)
      expect(prisma.task.updateMany).toHaveBeenCalledWith({
        where: {
          columnId: 'col1',
          order: { gt: 0, lte: 2 },
        },
        data: { order: { decrement: 1 } },
      });

      // Deve atualizar a tarefa movida
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 'task1' },
        data: { columnId: 'col1', order: 2 },
      });
    });

    it('should move task to another column and adjust orders', async () => {
      const mockTask = { id: 'task1', columnId: 'col1', order: 2 }; // Sai da col1 (pos 2)
      prisma.task.findUnique.mockResolvedValue(mockTask);

      // Movendo para col2 (pos 0)
      await service.updateTaskPosition('task1', 'col2', 0);

      // 1. Fecha o buraco na coluna antiga (decrementa quem estava abaixo de 2)
      expect(prisma.task.updateMany).toHaveBeenCalledWith({
        where: { columnId: 'col1', order: { gt: 2 } },
        data: { order: { decrement: 1 } },
      });

      // 2. Abre espaço na coluna nova (incrementa quem está de 0 para baixo)
      expect(prisma.task.updateMany).toHaveBeenCalledWith({
        where: { columnId: 'col2', order: { gte: 0 } },
        data: { order: { increment: 1 } },
      });

      // 3. Move a tarefa
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 'task1' },
        data: { columnId: 'col2', order: 0 },
      });
    });
  });
});
