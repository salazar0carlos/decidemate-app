import { Decision, DecisionCategory } from '../types/decision';
import { decisionsService } from './decisions';

// Analytics and pattern analysis functions
export interface AnalyticsStats {
  totalDecisions: number;
  reviewedDecisions: number;
  pendingDecisions: number;
  averageConfidence: number;
  averageOutcome: number;
  reviewCompletionRate: number;
  confidenceCalibration: number; // Difference between confidence and outcome
}

export interface CategoryStats {
  category: DecisionCategory;
  count: number;
  averageConfidence: number;
  averageOutcome: number;
  successRate: number;
}

export interface DayStats {
  day: string;
  count: number;
}

export const analyticsService = {
  // Get overall statistics
  async getOverallStats(): Promise<AnalyticsStats> {
    const decisions = await decisionsService.getAll();
    const activeDecisions = decisions.filter(d => !d.isArchived);
    const reviewedDecisions = activeDecisions.filter(d => d.outcome);

    const totalDecisions = activeDecisions.length;
    const reviewedCount = reviewedDecisions.length;
    const pendingCount = totalDecisions - reviewedCount;

    const averageConfidence = totalDecisions > 0
      ? activeDecisions.reduce((sum, d) => sum + d.confidenceLevel, 0) / totalDecisions
      : 0;

    const averageOutcome = reviewedCount > 0
      ? reviewedDecisions.reduce((sum, d) => sum + (d.outcome?.rating || 0), 0) / reviewedCount
      : 0;

    const reviewCompletionRate = totalDecisions > 0
      ? (reviewedCount / totalDecisions) * 100
      : 0;

    // Confidence calibration: positive means overconfident, negative means underconfident
    const confidenceCalibration = reviewedCount > 0
      ? reviewedDecisions.reduce((sum, d) => {
          const confidence = d.confidenceLevel;
          const outcome = d.outcome?.rating || 5;
          return sum + (confidence - outcome);
        }, 0) / reviewedCount
      : 0;

    return {
      totalDecisions,
      reviewedDecisions: reviewedCount,
      pendingDecisions: pendingCount,
      averageConfidence,
      averageOutcome,
      reviewCompletionRate,
      confidenceCalibration,
    };
  },

  // Get statistics by category
  async getCategoryStats(): Promise<CategoryStats[]> {
    const decisions = await decisionsService.getAll();
    const activeDecisions = decisions.filter(d => !d.isArchived);

    const categories: DecisionCategory[] = [
      'financial',
      'career',
      'relationships',
      'health',
      'business',
      'personal',
      'other',
    ];

    return categories.map(category => {
      const categoryDecisions = activeDecisions.filter(d => d.category === category);
      const reviewedInCategory = categoryDecisions.filter(d => d.outcome);

      const count = categoryDecisions.length;
      const averageConfidence = count > 0
        ? categoryDecisions.reduce((sum, d) => sum + d.confidenceLevel, 0) / count
        : 0;

      const averageOutcome = reviewedInCategory.length > 0
        ? reviewedInCategory.reduce((sum, d) => sum + (d.outcome?.rating || 0), 0) / reviewedInCategory.length
        : 0;

      const successRate = reviewedInCategory.length > 0
        ? (reviewedInCategory.filter(d => (d.outcome?.rating || 0) >= 7).length / reviewedInCategory.length) * 100
        : 0;

      return {
        category,
        count,
        averageConfidence,
        averageOutcome,
        successRate,
      };
    }).filter(stat => stat.count > 0);
  },

  // Get decision frequency by day of week
  async getDecisionFrequencyByDay(): Promise<DayStats[]> {
    const decisions = await decisionsService.getAll();
    const activeDecisions = decisions.filter(d => !d.isArchived);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts = new Array(7).fill(0);

    activeDecisions.forEach(decision => {
      const dayIndex = new Date(decision.createdAt).getDay();
      dayCounts[dayIndex]++;
    });

    return dayNames.map((day, index) => ({
      day,
      count: dayCounts[index],
    }));
  },

  // Get most active decision day
  async getMostActiveDay(): Promise<string> {
    const dayStats = await this.getDecisionFrequencyByDay();
    if (dayStats.length === 0) {
      return 'N/A';
    }

    const maxCount = Math.max(...dayStats.map(d => d.count));
    const mostActiveDay = dayStats.find(d => d.count === maxCount);

    return mostActiveDay?.day || 'N/A';
  },

  // Get best performing category
  async getBestCategory(): Promise<string> {
    const categoryStats = await this.getCategoryStats();
    if (categoryStats.length === 0) {
      return 'N/A';
    }

    const bestCategory = categoryStats.reduce((best, current) => {
      return current.averageOutcome > best.averageOutcome ? current : best;
    });

    return bestCategory.category;
  },

  // Get worst performing category
  async getWorstCategory(): Promise<string> {
    const categoryStats = await this.getCategoryStats();
    if (categoryStats.length === 0) {
      return 'N/A';
    }

    const worstCategory = categoryStats.reduce((worst, current) => {
      return current.averageOutcome < worst.averageOutcome ? current : worst;
    });

    return worstCategory.category;
  },

  // Generate insights
  async generateInsights(): Promise<string[]> {
    const stats = await this.getOverallStats();
    const categoryStats = await this.getCategoryStats();
    const mostActiveDay = await this.getMostActiveDay();
    const insights: string[] = [];

    // Confidence calibration insight
    if (stats.reviewedDecisions >= 3) {
      const calibrationPercent = Math.abs(stats.confidenceCalibration * 10);
      if (Math.abs(stats.confidenceCalibration) > 1) {
        if (stats.confidenceCalibration > 0) {
          insights.push(`You're ${calibrationPercent.toFixed(0)}% overconfident on average`);
        } else {
          insights.push(`You're ${calibrationPercent.toFixed(0)}% underconfident on average`);
        }
      } else {
        insights.push('Your confidence is well-calibrated!');
      }
    }

    // Most active day insight
    if (mostActiveDay !== 'N/A') {
      insights.push(`${mostActiveDay} is your most active decision day`);
    }

    // Best category insight
    const bestCategory = await this.getBestCategory();
    if (bestCategory !== 'N/A') {
      insights.push(`${bestCategory} decisions have your highest success rate`);
    }

    // Category-specific insights
    categoryStats.forEach(cat => {
      if (cat.count >= 3) {
        const calibration = cat.averageConfidence - cat.averageOutcome;
        if (Math.abs(calibration) > 1.5) {
          if (calibration > 0) {
            insights.push(`You're overconfident on ${cat.category} decisions`);
          } else {
            insights.push(`You're underconfident on ${cat.category} decisions`);
          }
        }
      }
    });

    // Review completion insight
    if (stats.totalDecisions >= 5) {
      if (stats.reviewCompletionRate < 30) {
        insights.push('Complete more reviews to unlock better insights');
      } else if (stats.reviewCompletionRate > 80) {
        insights.push('Great job staying on top of your reviews!');
      }
    }

    return insights.length > 0 ? insights : ['Make more decisions to unlock insights'];
  },
};
