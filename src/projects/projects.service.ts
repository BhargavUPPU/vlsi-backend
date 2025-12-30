import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: any, files?: Array<Express.Multer.File>) {
    console.log('========== CREATE PROJECT DEBUG ==========');
    console.log('1. Received createProjectDto:', JSON.stringify(createProjectDto, null, 2));
    console.log('2. Files received:', files?.length, 'files');
    
    // Parse array fields (they come as JSON strings from FormData)
    const arrayFields: any = {};
    if (createProjectDto.Members) {
      try {
        arrayFields.Members = JSON.parse(createProjectDto.Members);
        console.log('3. Parsed Members:', arrayFields.Members);
      } catch (e) {
        console.log('3. Failed to parse Members:', e);
        arrayFields.Members = [];
      }
    }
    if (createProjectDto.Tools) {
      try {
        arrayFields.Tools = JSON.parse(createProjectDto.Tools);
        console.log('4. Parsed Tools:', arrayFields.Tools);
      } catch (e) {
        console.log('4. Failed to parse Tools:', e);
        arrayFields.Tools = [];
      }
    }
    if (createProjectDto.referenceLinks) {
      try {
        arrayFields.referenceLinks = JSON.parse(createProjectDto.referenceLinks);
        console.log('5. Parsed referenceLinks:', arrayFields.referenceLinks);
      } catch (e) {
        console.log('5. Failed to parse referenceLinks:', e);
        arrayFields.referenceLinks = [];
      }
    }

    // Remove file-related fields
    const { files: _files, ...projectData } = createProjectDto;
    console.log('6. After filtering files:', Object.keys(projectData));
    
    console.log('7. Final data to create:', { ...projectData, ...arrayFields });

    // Use transaction to ensure atomicity
    return await this.prisma.$transaction(async (tx) => {
      console.log('8. Starting transaction...');
      
      const project = await tx.projects.create({
        data: {
          ...projectData,
          ...arrayFields,
        },
      });

      console.log('8a. Project created with ID:', project.id);

      // Save multiple files to ProjectImages table
      if (files && files.length > 0) {
        console.log('9. Starting to save', files.length, 'files...');
        try {
          const filePromises = files.map((file, index) => {
            console.log(`  - File ${index + 1}: size=${file.size}, mimetype=${file.mimetype}`);
            console.log(`  - Buffer length: ${file.buffer.length}`);
            
            return tx.projectImages.create({
              data: {
                projectId: project.id,
                fileData: new Uint8Array(file.buffer),
              },
            }).then(savedFile => {
              console.log(`  - Saved file ${index + 1} with ID: ${savedFile.id}`);              return savedFile;
            }).catch(err => {
              console.error(`  - ERROR saving file ${index + 1}:`, err);
              throw err;
            });
          });
          
          const savedFiles = await Promise.all(filePromises);
          console.log(`10. Successfully saved ${savedFiles.length} files for project ${project.id}`);
          console.log('10a. Saved file IDs:', savedFiles.map(f => f.id));
        } catch (error) {
          console.error('ERROR saving files:', error);
          throw error;
        }
      } else {
        console.log('9. No files to save');
      }

      // Return project with images - within same transaction
      const finalProject = await tx.projects.findUnique({
        where: { id: project.id },
        include: { images: true },
      });
      
      console.log('11. Final project with', finalProject?.images?.length, 'images');
      console.log('12. Transaction will commit now...');
      console.log('========== END CREATE PROJECT DEBUG ==========');
      
      return finalProject;
    });
  }

  async findAll(filters?: {
    status?: string;
    category?: string;
    academicYear?: string;
  }) {
    const where: any = {};
    
    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = filters.category;
    if (filters?.academicYear) where.academicYear = filters.academicYear;

    return this.prisma.projects.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.projects.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    // Check if project exists
    await this.findOne(id);

    return this.prisma.projects.update({
      where: { id },
      data: updateProjectDto,
      include: {
        images: true,
      },
    });
  }

  async remove(id: number) {
    // Check if project exists
    await this.findOne(id);

    return this.prisma.projects.delete({
      where: { id },
    });
  }

  // Image handling methods
  async addImage(projectId: number, imageBuffer: Buffer) {
    // Check if project exists
    await this.findOne(projectId);

    return this.prisma.projectImages.create({
      data: {
        projectId,
        fileData: new Uint8Array(imageBuffer),
      },
    });
  }

  async getImage(imageId: number) {
    const image = await this.prisma.projectImages.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    return image;
  }

  async removeImage(imageId: number) {
    const image = await this.prisma.projectImages.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    return this.prisma.projectImages.delete({
      where: { id: imageId },
    });
  }

  async getProjectsByYear(year: string) {
    return this.prisma.projects.findMany({
      where: { academicYear: year },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getProjectsByCategory(category: string) {
    return this.prisma.projects.findMany({
      where: { category },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
