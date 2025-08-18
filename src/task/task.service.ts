import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskInput: CreateTaskInput) : Promise<Task> {
    return this.prisma.task.create({ 
      data: {
        title: createTaskInput.title,
        description: createTaskInput.description,
      },
     });
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`)
    }
    return task;
  }

  async update(id: number, updateTaskInput: UpdateTaskInput): Promise<Task> {
    const {id: _, ...data} = updateTaskInput;
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Task> {
    return this.prisma.task.delete({ where: { id } });
  }
}
