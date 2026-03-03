import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    getBoard: jest.fn(),
    createColumn: jest.fn(),
    updateColumn: jest.fn(),
    deleteColumn: jest.fn(),
    createTask: jest.fn(),
    updateTaskPosition: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get board', async () => {
    await controller.getBoard();
    expect(service.getBoard).toHaveBeenCalled();
  });

  it('should create task', async () => {
    const dto = { text: 'New Task', columnId: '123' };
    await controller.createTask(dto);
    expect(service.createTask).toHaveBeenCalledWith(dto.text, dto.columnId);
  });
});
