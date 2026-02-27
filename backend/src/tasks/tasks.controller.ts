import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  //Rota para criar uma nova tarefa
  @Post()
  create(@Body() body: { texto: string; coluna: 'A Fazer' | 'Em Progresso' | 'Concluído' }) {
    return this.tasksService.create(body.texto, body.coluna);
  }

  //Rota para listar todas as tarefas
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  //Rota para quando mudar o card de coluna
  @Patch(':id/position')
  updatePosition(
    @Param('id') id: string,
    @Body() body: { novaColuna: 'A Fazer' | 'Em Progresso' | 'Concluído'; novaOrdem: number }
  ) {
    return this.tasksService.updatePosition(id, body.novaColuna, body.novaOrdem);
  }
}