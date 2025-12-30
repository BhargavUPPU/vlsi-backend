import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { ConfigModule } from '@nestjs/config';
import { ClubMembersModule } from './club-members/club-members.module';
import { CoreMembersModule } from './core-members/core-members.module';
import { ProjectsModule } from './projects/projects.module';
import { EventsModule } from './events/events.module';
import { QuestionBanksModule } from './question-banks/question-banks.module';
import { TextbooksModule } from './textbooks/textbooks.module';
import { NptelLecturesModule } from './nptel-lectures/nptel-lectures.module';
import { PlacementPrepModule } from './placement-prep/placement-prep.module';
import { VlsiMaterialsModule } from './vlsi-materials/vlsi-materials.module';
import { GatePyqsModule } from './gate-pyqs/gate-pyqs.module';
import { MagazinesModule } from './magazines/magazines.module';
import { TestsModule } from './tests/tests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TeamPhotosModule } from './team-photos/team-photos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule, ClubMembersModule, CoreMembersModule, ProjectsModule, EventsModule, QuestionBanksModule, TextbooksModule, NptelLecturesModule, PlacementPrepModule, VlsiMaterialsModule, GatePyqsModule, MagazinesModule, TestsModule, NotificationsModule, TeamPhotosModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const email = 'admin@vlsi.com';
    const password = 'admin123'; // Change this to a secure password
    const name = 'Admin User';

    // Check if admin already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Admin user already exists!');
      console.log(`Email: ${existingUser.email}`);
      console.log(`Role: ${existingUser.role}`);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('=====================================');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${admin.role}`);
    console.log('=====================================');
    console.log('⚠️  Please change the password after first login!');
  }
}
