import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
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
  providers: [AppService],
})
export class AppModule {}
