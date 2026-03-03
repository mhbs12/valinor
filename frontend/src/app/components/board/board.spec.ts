import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Board } from './board';
import { TaskService, Column } from '../../services/task';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';

describe('Board', () => {
  let component: Board;
  let fixture: ComponentFixture<Board>;
  
  // Mock manual usando Vitest
  const mockTaskService = {
    getBoard: vi.fn(),
    createColumn: vi.fn(),
    deleteColumn: vi.fn(),
    updateColumn: vi.fn(),
    createTask: vi.fn(),
    updateTaskPosition: vi.fn(),
    deleteTask: vi.fn()
  };

  const mockColumns: Column[] = [
    { id: '1', name: 'Col 1', order: 0, tasks: [] },
    { id: '2', name: 'Col 2', order: 1, tasks: [] },
    { id: '3', name: 'Col 3', order: 2, tasks: [] },
    { id: '4', name: 'Col 4', order: 3, tasks: [] },
    { id: '5', name: 'Col 5', order: 4, tasks: [] },
  ];

  beforeEach(async () => {
    // Limpa os mocks antes de cada teste
    vi.clearAllMocks();
    
    // Configura o retorno padrão do getBoard
    mockTaskService.getBoard.mockReturnValue(of(mockColumns));
    mockTaskService.createColumn.mockReturnValue(of({}));
    mockTaskService.deleteColumn.mockReturnValue(of({}));
    mockTaskService.updateColumn.mockReturnValue(of({}));
    mockTaskService.createTask.mockReturnValue(of({}));
    mockTaskService.updateTaskPosition.mockReturnValue(of({}));
    mockTaskService.deleteTask.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [Board],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Board);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara o ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load columns on init', () => {
    expect(mockTaskService.getBoard).toHaveBeenCalled();
    expect(component.columns().length).toBe(5);
  });

  describe('Masonry Layout Logic', () => {
    it('should distribute 5 columns into 4 lanes correctly', () => {

      const lanes = component.distributedColumns();
      
      expect(lanes.length).toBe(4);
      expect(lanes[0].length).toBe(2); // Col 1 e Col 5
      expect(lanes[1].length).toBe(1); // Col 2
      expect(lanes[2].length).toBe(1); // Col 3
      expect(lanes[3].length).toBe(1); // Col 4
      
      expect(lanes[0][0].id).toBe('1');
      expect(lanes[0][1].id).toBe('5');
    });

    it('should calculate the correct lane for the "Add Column" button', () => {
      expect(component.addColumnButtonLane()).toBe(1);
    });
  });

  describe('User Actions', () => {
    it('should add a column', () => {
      const newCol = { id: '6', name: 'New Col', order: 5, tasks: [] };
      mockTaskService.createColumn.mockReturnValue(of(newCol));

      component.newColumnName.set('New Col');
      component.addColumn();

      expect(mockTaskService.createColumn).toHaveBeenCalledWith('New Col');
      // Verifica se a nova coluna foi adicionada ao signal
      expect(component.columns().length).toBe(6);
      expect(component.newColumnName()).toBe(''); // Limpa o input
      expect(component.isAddingColumn()).toBe(false); // Fecha o form
    });

    it('should not add column if name is empty', () => {
      component.newColumnName.set('   ');
      component.addColumn();

      expect(mockTaskService.createColumn).not.toHaveBeenCalled();
    });
  });
});
