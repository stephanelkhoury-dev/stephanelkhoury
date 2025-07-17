import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient, ProjectRole, ProjectStatus } from 'db';
import { CreateProjectDto, UpdateProjectDto, AddProjectMemberDto, UpdateProjectMemberDto, ProjectQueryDto } from './dto/project.dto';

const prisma = new PrismaClient();

@Injectable()
export class ProjectService {
  async createProject(userId: string, dto: CreateProjectDto) {
    return prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status || ProjectStatus.PLANNING,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getProjects(userId: string, query: ProjectQueryDto) {
    const where = {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
      ...(query.status && { status: query.status }),
    };

    return prisma.project.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ...(query.includeMembers && {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        }),
        ...(query.includeTasks && {
          tasks: {
            include: {
              assignee: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        }),
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isProjectMember = project.ownerId === userId || 
      project.members.some(member => member.userId === userId);

    if (!isProjectMember) {
      throw new ForbiddenException('Not authorized to access this project');
    }

    return project;
  }

  async updateProject(projectId: string, userId: string, dto: UpdateProjectDto) {
    const project = await this.validateProjectOwnership(projectId, userId);

    return prisma.project.update({
      where: { id: projectId },
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteProject(projectId: string, userId: string) {
    await this.validateProjectOwnership(projectId, userId);

    await prisma.project.delete({
      where: { id: projectId },
    });

    return { message: 'Project deleted successfully' };
  }

  async addProjectMember(projectId: string, userId: string, dto: AddProjectMemberDto) {
    await this.validateProjectOwnership(projectId, userId);

    return prisma.projectMember.create({
      data: {
        projectId,
        userId: dto.userId,
        role: dto.role || ProjectRole.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateProjectMember(
    projectId: string,
    memberId: string,
    userId: string,
    dto: UpdateProjectMemberDto,
  ) {
    await this.validateProjectOwnership(projectId, userId);

    return prisma.projectMember.update({
      where: { id: memberId },
      data: { role: dto.role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async removeProjectMember(projectId: string, memberId: string, userId: string) {
    await this.validateProjectOwnership(projectId, userId);

    await prisma.projectMember.delete({
      where: { id: memberId },
    });

    return { message: 'Project member removed successfully' };
  }

  private async validateProjectOwnership(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Not authorized to modify this project');
    }

    return project;
  }
}
