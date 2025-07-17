import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
