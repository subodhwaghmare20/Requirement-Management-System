import { Requirement } from '../models/Requirement';
import { User } from '../models/User';
import { Application } from '../models/Application';
import { ApplicationClick } from '../models/ApplicationClick';
import { RequirementService } from './requirementService';

export interface AnalyticsFilterOptions {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  sourcePlatform?: string;
  location?: string;
}

export class AnalyticsService {
  public static async getAnalyticsData(options: AnalyticsFilterOptions = {}) {
    await RequirementService.updateExpiredRequirements();

    const reqFilter: any = {};
    const dateFilter: any = {};

    if (options.startDate || options.endDate) {
      dateFilter.createdAt = {};
      if (options.startDate) {
        dateFilter.createdAt.$gte = new Date(options.startDate);
      }
      if (options.endDate) {
        dateFilter.createdAt.$lte = new Date(options.endDate);
      }
      Object.assign(reqFilter, dateFilter);
    }

    if (options.categoryId) {
      reqFilter.categoryId = options.categoryId;
    }

    if (options.sourcePlatform) {
      reqFilter.sourcePlatform = options.sourcePlatform;
    }

    if (options.location) {
      reqFilter.location = new RegExp(options.location, 'i');
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // 1. Calculate KPI Metrics
    const [
      totalRequirements,
      activeRequirements,
      expiredRequirements,
      requirementsThisMonth,
      totalStudents,
      portalApplications,
      externalApplyClicks,
      requirementsList,
    ] = await Promise.all([
      Requirement.countDocuments(reqFilter),
      Requirement.countDocuments({ ...reqFilter, status: 'PUBLISHED' }),
      Requirement.countDocuments({ ...reqFilter, status: 'EXPIRED' }),
      Requirement.countDocuments({ ...reqFilter, createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ role: 'STUDENT' }),
      Application.countDocuments(),
      ApplicationClick.countDocuments(),
      Requirement.find(reqFilter).select('title companyName skills location sourcePlatform viewsCount clicksCount status createdAt'),
    ]);

    const totalJobViews = requirementsList.reduce((acc, r) => acc + (r.viewsCount || 0), 0);

    // 2. Aggregate Requirements by Technology (Skills)
    const skillCounts: Record<string, number> = {};
    requirementsList.forEach((req) => {
      if (Array.isArray(req.skills)) {
        req.skills.forEach((skill) => {
          const s = skill.trim();
          if (s) {
            skillCounts[s] = (skillCounts[s] || 0) + 1;
          }
        });
      }
    });

    const byTechnology = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 3. Aggregate Requirements by Location
    const locationCounts: Record<string, number> = {};
    requirementsList.forEach((req) => {
      if (req.location) {
        const loc = req.location.trim();
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
      }
    });

    const byLocation = Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 4. Aggregate Requirements by Source Platform
    const platformCounts: Record<string, number> = {};
    requirementsList.forEach((req) => {
      if (req.sourcePlatform) {
        const p = req.sourcePlatform.trim();
        platformCounts[p] = (platformCounts[p] || 0) + 1;
      }
    });

    const bySourcePlatform = Object.entries(platformCounts).map(([name, count]) => ({
      name,
      count,
    }));

    // 5. Aggregate Monthly Trends over past 6 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const pastMonths: { label: string; monthIndex: number; year: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      pastMonths.push({
        label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
      });
    }

    const requirementsByMonth = pastMonths.map(({ label, monthIndex, year }) => {
      const count = requirementsList.filter((r) => {
        const cd = new Date(r.createdAt);
        return cd.getMonth() === monthIndex && cd.getFullYear() === year;
      }).length;
      return { month: label, count };
    });

    // Applications & Apply Clicks Monthly Aggregation
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [rawApplications, rawClicks] = await Promise.all([
      Application.find({ appliedAt: { $gte: sixMonthsAgo } }).select('appliedAt'),
      ApplicationClick.find({ clickedAt: { $gte: sixMonthsAgo } }).select('clickedAt'),
    ]);

    const applicationsByMonth = pastMonths.map(({ label, monthIndex, year }) => {
      const count = rawApplications.filter((a) => {
        const cd = new Date(a.appliedAt);
        return cd.getMonth() === monthIndex && cd.getFullYear() === year;
      }).length;
      return { month: label, count };
    });

    const applyClicksByMonth = pastMonths.map(({ label, monthIndex, year }) => {
      const count = rawClicks.filter((c) => {
        const cd = new Date(c.clickedAt);
        return cd.getMonth() === monthIndex && cd.getFullYear() === year;
      }).length;
      return { month: label, count };
    });

    // 6. Job Performance Breakdown
    const reqIds = requirementsList.map((r) => r._id);
    const appCountsRaw = await Application.aggregate([
      { $match: { requirementId: { $in: reqIds } } },
      { $group: { _id: '$requirementId', count: { $sum: 1 } } },
    ]);

    const appCountMap = new Map();
    appCountsRaw.forEach((item) => {
      appCountMap.set(item._id.toString(), item.count);
    });

    const jobPerformance = requirementsList.slice(0, 15).map((req) => ({
      _id: req._id,
      title: req.title,
      companyName: req.companyName || 'Company',
      sourcePlatform: req.sourcePlatform,
      viewsCount: req.viewsCount || 0,
      portalApplicationsCount: appCountMap.get(req._id.toString()) || 0,
      clicksCount: req.clicksCount || 0,
    }));

    return {
      metrics: {
        totalRequirements,
        activeRequirements,
        expiredRequirements,
        requirementsThisMonth,
        totalStudents,
        portalApplications,
        externalApplyClicks,
        totalJobViews,
      },
      charts: {
        byTechnology,
        byLocation,
        bySourcePlatform,
        requirementsByMonth,
        applicationsByMonth,
        applyClicksByMonth,
      },
      jobPerformance,
    };
  }
}
