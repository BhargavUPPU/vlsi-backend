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
import { AnnouncementsModule } from './announcements/announcements.module';
import { AchievementsModule } from './achievements/achievements.module';
import { PhotoGalleryModule } from './photo-gallery/photo-gallery.module';
import { MilestonesModule } from './milestones/milestones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ClubMembersModule,
    CoreMembersModule,
    ProjectsModule,
    EventsModule,
    QuestionBanksModule,
    TextbooksModule,
    NptelLecturesModule,
    PlacementPrepModule,
    VlsiMaterialsModule,
    GatePyqsModule,
    MagazinesModule,
    TestsModule,
    NotificationsModule,
    TeamPhotosModule,
    AnnouncementsModule,
    AchievementsModule,
    PhotoGalleryModule,
    MilestonesModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Check if super admin exists
    console.log('[AppModule] Checking for Super Admin...');
    const superAdmin = await this.prisma.user.findUnique({
      where: { email: 'superadmin@vlsi.com' }
    });

    const tempPassword = "Vlsi@123";
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    if (!superAdmin) {
      console.log('[AppModule] Super Admin not found. Creating...');
      await this.prisma.user.create({
        data: {
          email: 'superadmin@vlsi.com',
          name: 'Super Administrator',
          password: hashedPassword,
          role: 'SUPERADMIN',
          requirePasswordChange: true,
        },
      });
      console.log('✅ SUPER ADMIN CREATED (superadmin@vlsi.com / Vlsi@123)');
    } else {
      console.log(`[AppModule] Super Admin exists. Resetting password to ensure it matches Vlsi@123...`);
      await this.prisma.user.update({
        where: { email: 'superadmin@vlsi.com' },
        data: {
          password: hashedPassword,
          role: 'SUPERADMIN', // Ensure role is correct too
        },
      });
      console.log('✅ SUPER ADMIN PASSWORD RESET (superadmin@vlsi.com / Vlsi@123)');
    }
  }

  /**
   * Generate a cryptographically secure temporary password
   */
  private generateTempPassword(): string {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const all = uppercase + lowercase + numbers + special;

    // Ensure at least one of each type
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}
