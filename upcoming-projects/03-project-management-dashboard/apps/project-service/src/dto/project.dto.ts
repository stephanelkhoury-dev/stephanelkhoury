import { IsString, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';
import { ProjectStatus, ProjectRole } from 'db';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class AddProjectMemberDto {
  @IsString()
  userId: string;

  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole;
}

export class UpdateProjectMemberDto {
  @IsEnum(ProjectRole)
  role: ProjectRole;
}

export class ProjectQueryDto {
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsArray()
  @IsOptional()
  includeMembers?: boolean;

  @IsArray()
  @IsOptional()
  includeTasks?: boolean;
}
