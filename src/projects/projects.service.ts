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

  async findOne(id: string) {
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

  async update(id: string, updateProjectDto: any, files?: Array<Express.Multer.File>) {
    // Add debug info
    console.log('========== UPDATE PROJECT DEBUG ==========', id);
    console.log('1. Raw updateProjectDto:', JSON.stringify(updateProjectDto, null, 2));
    console.log('2. Files passed to update():', files?.length || 0);

    // Parse array fields (same as create)
    const arrayFields: any = {};
    if (updateProjectDto.Members) {
      try {
        arrayFields.Members = JSON.parse(updateProjectDto.Members);
        console.log('3. Parsed Members:', arrayFields.Members);
      } catch (e) {
        console.log('3. Failed to parse Members:', e);
        // If it's already an array, keep it
        if (Array.isArray(updateProjectDto.Members)) {
          arrayFields.Members = updateProjectDto.Members;
        }
      }
    }
    if (updateProjectDto.Tools) {
      try {
        arrayFields.Tools = JSON.parse(updateProjectDto.Tools);
        console.log('4. Parsed Tools:', arrayFields.Tools);
      } catch (e) {
        console.log('4. Failed to parse Tools:', e);
        if (Array.isArray(updateProjectDto.Tools)) {
          arrayFields.Tools = updateProjectDto.Tools;
        }
      }
    }
    if (updateProjectDto.referenceLinks) {
      try {
        arrayFields.referenceLinks = JSON.parse(updateProjectDto.referenceLinks);
        console.log('5. Parsed referenceLinks:', arrayFields.referenceLinks);
      } catch (e) {
        console.log('5. Failed to parse referenceLinks:', e);
        if (Array.isArray(updateProjectDto.referenceLinks)) {
          arrayFields.referenceLinks = updateProjectDto.referenceLinks;
        }
      }
    }

    // Remove file-related and relational fields if any (for consistency with create)
    const {
      files: _files,
      images: _images,
      include: _include,
      existingFileIds: _existingFileIds,
      ...projectData
    } = updateProjectDto;
    const removedFields: string[] = [];
    if (_images !== undefined) removedFields.push('images');
    if (_include !== undefined) removedFields.push('include');
    console.log('6. After filtering files and relations:', Object.keys(projectData),
      removedFields.length ? `(removed: ${removedFields.join(', ')})` : '');

    const dataToUpdate = { ...projectData, ...arrayFields };

    // Parse existingFileIds if provided (client sends JSON string or array)
    let existingFileIds: string[] | undefined;
    if (_existingFileIds !== undefined) {
      try {
        existingFileIds = typeof _existingFileIds === 'string' ? JSON.parse(_existingFileIds) : _existingFileIds;
      } catch (e) {
        if (Array.isArray(_existingFileIds)) existingFileIds = _existingFileIds;
      }
    }
    console.log('7. Final data to update:', JSON.stringify(dataToUpdate, null, 2));

    // Ensure project exists before attempting update
    await this.findOne(id);

    // If new files are provided, store them within a transaction along with the update
    if (files && files.length > 0) {
      console.log('8. Saving', files.length, 'new files with update...');
      return this.prisma.$transaction(async (tx) => {
        const updated = await tx.projects.update({
          where: { id },
          data: dataToUpdate,
          include: { images: true },
        });

        const filePromises = files.map((file, index) => {
          console.log(`  - Storing file ${index + 1}: size=${file.size}, mimetype=${file.mimetype}`);
          return tx.projectImages.create({
            data: {
              projectId: id,
              fileData: new Uint8Array(file.buffer),
            },
          });
        });
        const savedFiles = await Promise.all(filePromises);
        console.log('9. Saved new file IDs:', savedFiles.map(f => f.id));

        // If client provided existingFileIds, remove any images not in that list
        if (existingFileIds !== undefined) {
          console.log('10. Removing images not in existingFileIds:', existingFileIds);
          await tx.projectImages.deleteMany({
            where: {
              projectId: id,
              id: { notIn: existingFileIds },
            },
          });
        }

        // return updated project with fresh images list
        return tx.projects.findUnique({
          where: { id },
          include: { images: true },
        });
      });
    }

    // If existingFileIds provided, perform update and deletion atomically in a transaction
    if (existingFileIds !== undefined) {
      return this.prisma.$transaction(async (tx) => {
        await tx.projects.update({
          where: { id },
          data: dataToUpdate,
        });

        await tx.projectImages.deleteMany({
          where: {
            projectId: id,
            id: { notIn: existingFileIds },
          },
        });

        return tx.projects.findUnique({ where: { id }, include: { images: true } });
      });
    }

    return this.prisma.projects.update({
      where: { id },
      data: dataToUpdate,
      include: {
        images: true,
      },
    });
  }

  async remove(id: string) {
    // Check if project exists
    await this.findOne(id);

    return this.prisma.projects.delete({
      where: { id },
    });
  }

  // Image handling methods
  async addImage(projectId: string, imageBuffer: Buffer) {
    // Check if project exists
    await this.findOne(projectId);

    return this.prisma.projectImages.create({
      data: {
        projectId,
        fileData: new Uint8Array(imageBuffer),
      },
    });
  }

  async getImage(imageId: string) {
    const image = await this.prisma.projectImages.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    return image;
  }

  async removeImage(imageId: string) {
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
