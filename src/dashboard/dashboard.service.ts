import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard statistics with optimized queries
   * Uses count() instead of fetching all records
   */
  async getDashboardStats() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Parallel execution for better performance
      const [
        totalMembers,
        totalEvents,
        activeEvents,
        totalProjects,
        recentProjects,
        totalTextbooks,
        totalVlsiMaterials,
        totalNptelLectures,
      ] = await Promise.all([
        // Count club members
        this.prisma.clubMembers.count(),

        // Count total events
        this.prisma.event.count(),

        // Count active events (future events)
        this.prisma.event.count({
          where: {
            eventDate: {
              gte: now,
            },
          },
        }),

        // Count total projects
        this.prisma.projects.count(),

        // Count projects created this month
        this.prisma.projects.count({
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }),

        // Count textbooks
        this.prisma.textBook.count(),

        // Count VLSI materials
        this.prisma.vlsiMaterial.count(),

        // Count NPTEL lectures
        this.prisma.nptelLecture.count(),
      ]);

      const totalResources = totalTextbooks + totalVlsiMaterials + totalNptelLectures;

      return {
        success: true,
        data: {
          totalMembers,
          totalEvents,
          activeEvents,
          totalProjects,
          recentProjects,
          totalResources,
          breakdown: {
            textbooks: totalTextbooks,
            vlsiMaterials: totalVlsiMaterials,
            nptelLectures: totalNptelLectures,
          },
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error fetching dashboard stats: ${error.message}`, error.stack);
      return {
        success: false,
        error: 'Failed to fetch dashboard statistics',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      };
    }
  }

  /**
   * Get recent activity from various entities
   * Optimized to fetch only needed fields
   */
  async getRecentActivity(limit: number = 10) {
    try {
      const itemLimit = Math.ceil(limit / 3); // Distribute limit across three sources

      const [members, events, projects] = await Promise.all([
        // Get recent members - only needed fields
        this.prisma.clubMembers.findMany({
          select: {
            id: true,
            name: true,
            rollNumber: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: itemLimit,
        }),

        // Get recent events - only needed fields
        this.prisma.event.findMany({
          select: {
            id: true,
            title: true,
            description: true,
            eventDate: true,
          },
          orderBy: { eventDate: 'desc' },
          take: itemLimit,
        }),

        // Get recent projects - only needed fields
        this.prisma.projects.findMany({
          select: {
            id: true,
            title: true,
            Introduction: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: 'desc' },
          take: itemLimit,
        }),
      ]);

      // Transform to activity format
      const activities = [
        ...members.map((member) => ({
          type: 'member',
          icon: 'Users',
          title: `New member: ${member.name}`,
          description: member.rollNumber || '',
          timestamp: member.createdAt,
          color: 'blue',
          entityId: member.id,
        })),
        ...events.map((event) => ({
          type: 'event',
          icon: 'Calendar',
          title: `Event: ${event.title}`,
          description: event.description || '',
          timestamp: event.eventDate,
          color: 'green',
          entityId: event.id,
        })),
        ...projects.map((project) => ({
          type: 'project',
          icon: 'FolderOpen',
          title: `Project: ${project.title}`,
          description: project.Introduction || '',
          timestamp: project.updatedAt,
          color: 'purple',
          entityId: project.id,
        })),
      ];

      // Sort by timestamp and limit
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);

      return {
        success: true,
        data: sortedActivities,
        count: sortedActivities.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error fetching recent activity: ${error.message}`, error.stack);
      return {
        success: false,
        error: 'Failed to fetch recent activity',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      };
    }
  }

  /**
   * Get complete dashboard overview (stats + activity)
   * Most efficient endpoint - single request for all data
   */
  async getCompleteOverview(activityLimit: number = 10) {
    try {
      const [stats, activity] = await Promise.all([
        this.getDashboardStats(),
        this.getRecentActivity(activityLimit),
      ]);

      return {
        success: stats.success && activity.success,
        stats: stats.data,
        activity: activity.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error fetching dashboard overview: ${error.message}`, error.stack);
      return {
        success: false,
        error: 'Failed to fetch dashboard overview',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      };
    }
  }
}
