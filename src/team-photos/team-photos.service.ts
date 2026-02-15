import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamPhotosService {
  constructor(private prisma: PrismaService) {}

  async create(academicYear: string, imageBuffers: Buffer[]) {
    const imagesData = imageBuffers.slice(0, 5).map(buffer => ({
      imageData: new Uint8Array(buffer),
    }));

    // use upsert so that attempting to create a gallery for a year that already
    // exists will simply replace the images rather than throw a unique-constraint
    // error. the controller has an explicit PUT route for updates, but this
    // behaviour makes the POST idempotent and avoids Prisma P2002 exceptions.
    return this.prisma.teamPhoto.upsert({
      where: { academicYear },
      create: {
        academicYear,
        images: { create: imagesData },
      },
      update: {
        // delete existing images first to avoid lingering blobs
        images: {
          deleteMany: {},
          create: imagesData,
        },
      },
      include: { images: true },
    });
  }

  findAll() {
    return this.prisma.teamPhoto.findMany({
      include: { images: true },
      orderBy: { academicYear: 'desc' },
    });
  }

  async findOne(id: string) {
    const photo = await this.prisma.teamPhoto.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!photo) throw new NotFoundException(`Team Photo ${id} not found`);
    return photo;
  }

  async findByYear(year: string) {
    const photo = await this.prisma.teamPhoto.findUnique({
      where: { academicYear: year },
      include: { images: true },
    });
    if (!photo) throw new NotFoundException(`Team Photo for year ${year} not found`);
    return photo;
  }

  async update(
    id: string,
    updateDto: Partial<{ academicYear: string }> = {},
    imageBuffers: Buffer[] = [],
  ) {
    // ensure gallery exists and grab current values
    const existing = await this.findOne(id);

    // if academicYear is being changed, ensure it doesn't conflict with
    // another record (unique constraint on the column)
    if (
      updateDto.academicYear &&
      updateDto.academicYear !== existing.academicYear
    ) {
      const conflict = await this.prisma.teamPhoto.findUnique({
        where: { academicYear: updateDto.academicYear },
      });
      if (conflict) {
        throw new BadRequestException(
          `Team photo for academic year ${updateDto.academicYear} already exists`,
        );
      }
    }

    // prepare data object for update
    const data: any = {};
    if (updateDto.academicYear) {
      data.academicYear = updateDto.academicYear;
    }

    if (imageBuffers && imageBuffers.length > 0) {
      // delete old images first
      await this.prisma.teamPhotoImage.deleteMany({
        where: { teamPhotoId: id },
      });
      data.images = {
        create: imageBuffers.slice(0, 5).map(buffer => ({
          imageData: new Uint8Array(buffer),
        })),
      };
    }

    // if nothing was changed (no new year and no buffers) just return existing
    if (Object.keys(data).length === 0) {
      return existing;
    }

    return this.prisma.teamPhoto.update({
      where: { id },
      data,
      include: { images: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.teamPhoto.delete({ where: { id } });
  }

  async getImages(id: string) {
    const photo = await this.findOne(id);
    return photo.images.map(img => img.imageData);
  }
}
