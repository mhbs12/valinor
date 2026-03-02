import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  //Endpoint GET /tasks - Retorna todo o quadro
  @Get()
  getBoard() {
    return this.tasksService.getBoard();
  }

  //Endpoint POST /tasks/column - Cria uma nova coluna
  @Post('column')
  createColumn(@Body() body: { name: string }) {
    return this.tasksService.createColumn(body.name);
  }

  //Endpoint PATCH /tasks/column/:id - Atualiza nome da coluna
  @Patch('column/:id')
  updateColumn(@Param('id') id: string, @Body() body: { name: string }) {
    return this.tasksService.updateColumn(id, body.name);
  }

  @Delete('column/:id')
  deleteColumn(@Param('id') id: string) {
    return this.tasksService.deleteColumn(id);
  }

  //Endpoint POST /tasks - Cria uma nova tarefa
  @Post()
  createTask(@Body() body: { text: string; columnId: string }) {
    return this.tasksService.createTask(body.text, body.columnId);
  }

  //Endpoint PATCH /tasks/:id/position - Move tarefa
  @Patch(':id/position')
  updatePosition(
    @Param('id') id: string,
    @Body() body: { columnId: string; order: number }
  ) {
    return this.tasksService.updateTaskPosition(id, body.columnId, body.order);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}