import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get dashboard statistics
   * Optimized endpoint that returns all stats in one request
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    return this.dashboardService.getDashboardStats();
  }

  /**
   * Get recent activity
   * Returns recent activities from various entities
   */
  @Get('activity')
  @UseGuards(JwtAuthGuard)
  async getRecentActivity(@Query('limit') limit?: string) {
    const l = limit ? parseInt(limit, 10) : 10;
    return this.dashboardService.getRecentActivity(l);
  }

  /**
   * Get complete dashboard data (stats + activity)
   * Single endpoint for all dashboard data - most efficient
   */
  @Get('overview')
  @UseGuards(JwtAuthGuard)
  async getOverview(@Query('activityLimit') activityLimit?: string) {
    const limit = activityLimit ? parseInt(activityLimit, 10) : 10;
    return this.dashboardService.getCompleteOverview(limit);
  }
}
