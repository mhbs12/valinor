import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getBoard() {
    return this.prisma.column.findMany({
      include: {
        tasks: { orderBy: { order: 'asc' } },
      },
      orderBy: { order: 'asc' },
    });
  }

  async createTask(text: string, columnId: string) {
    const lastTask = await this.prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastTask ? lastTask.order + 1 : 0;

    return this.prisma.task.create({
      data: {
        text,
        columnId,
        order: newOrder,
      },
    });
  }

  async updateTaskPosition(id: string, newColumnId: string, newOrder: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new Error('Tarefa não encontrada');

    const oldColumnId = task.columnId;
    const oldOrder = task.order;

    return this.prisma.$transaction(async (tx) => {
      if (oldColumnId === newColumnId) {
        if (oldOrder === newOrder) return task;

        if (oldOrder < newOrder) {
          await tx.task.updateMany({
            where: {
              columnId: oldColumnId,
              order: { gt: oldOrder, lte: newOrder },
            },
            data: { order: { decrement: 1 } },
          });
        } else {
          await tx.task.updateMany({
            where: {
              columnId: oldColumnId,
              order: { gte: newOrder, lt: oldOrder },
            },
            data: { order: { increment: 1 } },
          });
        }
      } else {
        await tx.task.updateMany({
          where: {
            columnId: oldColumnId,
            order: { gt: oldOrder },
          },
          data: { order: { decrement: 1 } },
        });

        await tx.task.updateMany({
          where: {
            columnId: newColumnId,
            order: { gte: newOrder },
          },
          data: { order: { increment: 1 } },
        });
      }

      return tx.task.update({
        where: { id },
        data: { columnId: newColumnId, order: newOrder },
      });
    });
  }

  async deleteTask(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async createColumn(name: string) {
    const lastCol = await this.prisma.column.findFirst({
      orderBy: { order: 'desc' },
    });
    const newOrder = lastCol ? lastCol.order + 1 : 0;

    return this.prisma.column.create({
      data: { name, order: newOrder },
    });
  }

  async updateColumn(id: string, name: string) {
    return this.prisma.column.update({
      where: { id },
      data: { name },
    });
  }

  async deleteColumn(id: string) {
    return this.prisma.column.delete({ where: { id } });
  }
}
