"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProjectDto, files) {
        console.log('========== CREATE PROJECT DEBUG ==========');
        console.log('1. Received createProjectDto:', JSON.stringify(createProjectDto, null, 2));
        console.log('2. Files received:', files?.length, 'files');
        const arrayFields = {};
        if (createProjectDto.Members) {
            try {
                arrayFields.Members = JSON.parse(createProjectDto.Members);
                console.log('3. Parsed Members:', arrayFields.Members);
            }
            catch (e) {
                console.log('3. Failed to parse Members:', e);
                arrayFields.Members = [];
            }
        }
        if (createProjectDto.Tools) {
            try {
                arrayFields.Tools = JSON.parse(createProjectDto.Tools);
                console.log('4. Parsed Tools:', arrayFields.Tools);
            }
            catch (e) {
                console.log('4. Failed to parse Tools:', e);
                arrayFields.Tools = [];
            }
        }
        if (createProjectDto.referenceLinks) {
            try {
                arrayFields.referenceLinks = JSON.parse(createProjectDto.referenceLinks);
                console.log('5. Parsed referenceLinks:', arrayFields.referenceLinks);
            }
            catch (e) {
                console.log('5. Failed to parse referenceLinks:', e);
                arrayFields.referenceLinks = [];
            }
        }
        const { files: _files, ...projectData } = createProjectDto;
        console.log('6. After filtering files:', Object.keys(projectData));
        console.log('7. Final data to create:', { ...projectData, ...arrayFields });
        return await this.prisma.$transaction(async (tx) => {
            console.log('8. Starting transaction...');
            const project = await tx.projects.create({
                data: {
                    ...projectData,
                    ...arrayFields,
                },
            });
            console.log('8a. Project created with ID:', project.id);
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
                            console.log(`  - Saved file ${index + 1} with ID: ${savedFile.id}`);
                            return savedFile;
                        }).catch(err => {
                            console.error(`  - ERROR saving file ${index + 1}:`, err);
                            throw err;
                        });
                    });
                    const savedFiles = await Promise.all(filePromises);
                    console.log(`10. Successfully saved ${savedFiles.length} files for project ${project.id}`);
                    console.log('10a. Saved file IDs:', savedFiles.map(f => f.id));
                }
                catch (error) {
                    console.error('ERROR saving files:', error);
                    throw error;
                }
            }
            else {
                console.log('9. No files to save');
            }
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
    async findAll(filters) {
        const where = {};
        if (filters?.status)
            where.status = filters.status;
        if (filters?.category)
            where.category = filters.category;
        if (filters?.academicYear)
            where.academicYear = filters.academicYear;
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
    async findOne(id) {
        const project = await this.prisma.projects.findUnique({
            where: { id },
            include: {
                images: true,
            },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async update(id, updateProjectDto) {
        await this.findOne(id);
        return this.prisma.projects.update({
            where: { id },
            data: updateProjectDto,
            include: {
                images: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.projects.delete({
            where: { id },
        });
    }
    async addImage(projectId, imageBuffer) {
        await this.findOne(projectId);
        return this.prisma.projectImages.create({
            data: {
                projectId,
                fileData: new Uint8Array(imageBuffer),
            },
        });
    }
    async getImage(imageId) {
        const image = await this.prisma.projectImages.findUnique({
            where: { id: imageId },
        });
        if (!image) {
            throw new common_1.NotFoundException(`Image with ID ${imageId} not found`);
        }
        return image;
    }
    async removeImage(imageId) {
        const image = await this.prisma.projectImages.findUnique({
            where: { id: imageId },
        });
        if (!image) {
            throw new common_1.NotFoundException(`Image with ID ${imageId} not found`);
        }
        return this.prisma.projectImages.delete({
            where: { id: imageId },
        });
    }
    async getProjectsByYear(year) {
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
    async getProjectsByCategory(category) {
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
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map