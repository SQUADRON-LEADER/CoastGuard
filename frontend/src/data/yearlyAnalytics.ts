// Multi-year analytics data for CoastGuard platform (2020-2025)

export interface YearlyAnalytics {
  year: number;
  totalReports: number;
  verifiedReports: number;
  activeUsers: number;
  responseTime: number; // in hours
  monthlyData: MonthlyData[];
  hazardTypes: HazardTypeData[];
  severityBreakdown: SeverityData[];
  geographicData: GeographicData[];
  communityEngagement: CommunityData;
  seasonalTrends: SeasonalData[];
}

export interface MonthlyData {
  month: string;
  monthNumber: number;
  reports: number;
  verified: number;
  rejected: number;
  users: number;
  avgResponseTime: number;
  accuracy: number;
}

export interface HazardTypeData {
  type: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  severity: {
    critical: number;
    severe: number;
    serious: number;
    moderate: number;
    mild: number;
  };
}

export interface SeverityData {
  level: string;
  count: number;
  percentage: number;
  avgResponseTime: number;
}

export interface GeographicData {
  region: string;
  reports: number;
  trend: number;
  coordinates: [number, number];
}

export interface CommunityData {
  totalMembers: number;
  activeMembers: number;
  contributionScore: number;
  verificationAccuracy: number;
}

export interface SeasonalData {
  season: string;
  reports: number;
  dominantHazards: string[];
  avgSeverity: number;
  responseTime: number;
}

// Mock data for different years (2020-2025)
export const yearlyAnalyticsData: YearlyAnalytics[] = [
  {
    year: 2020,
    totalReports: 8420,
    verifiedReports: 6234,
    activeUsers: 1250,
    responseTime: 4.8,
    monthlyData: [
      { month: 'January', monthNumber: 1, reports: 620, verified: 455, rejected: 165, users: 98, avgResponseTime: 5.2, accuracy: 73.4 },
      { month: 'February', monthNumber: 2, reports: 580, verified: 431, rejected: 149, users: 105, avgResponseTime: 4.9, accuracy: 74.3 },
      { month: 'March', monthNumber: 3, reports: 740, verified: 562, rejected: 178, users: 112, avgResponseTime: 4.6, accuracy: 75.9 },
      { month: 'April', monthNumber: 4, reports: 890, verified: 681, rejected: 209, users: 125, avgResponseTime: 4.2, accuracy: 76.5 },
      { month: 'May', monthNumber: 5, reports: 950, verified: 738, rejected: 212, users: 134, avgResponseTime: 3.8, accuracy: 77.7 },
      { month: 'June', monthNumber: 6, reports: 1020, verified: 801, rejected: 219, users: 142, avgResponseTime: 3.5, accuracy: 78.5 },
      { month: 'July', monthNumber: 7, reports: 1180, verified: 932, rejected: 248, users: 156, avgResponseTime: 3.2, accuracy: 79.0 },
      { month: 'August', monthNumber: 8, reports: 1100, verified: 871, rejected: 229, users: 148, avgResponseTime: 3.4, accuracy: 79.2 },
      { month: 'September', monthNumber: 9, reports: 980, verified: 762, rejected: 218, users: 138, avgResponseTime: 3.7, accuracy: 77.8 },
      { month: 'October', monthNumber: 10, reports: 810, verified: 615, rejected: 195, users: 128, avgResponseTime: 4.1, accuracy: 75.9 },
      { month: 'November', monthNumber: 11, reports: 720, verified: 538, rejected: 182, users: 118, avgResponseTime: 4.5, accuracy: 74.7 },
      { month: 'December', monthNumber: 12, reports: 820, verified: 615, rejected: 205, users: 125, avgResponseTime: 4.8, accuracy: 75.0 }
    ],
    hazardTypes: [
      { type: 'coastal_erosion', count: 2890, percentage: 34.3, trend: 'up', severity: { critical: 125, severe: 578, serious: 867, moderate: 890, mild: 430 } },
      { type: 'oil_spill', count: 1680, percentage: 19.9, trend: 'stable', severity: { critical: 340, severe: 504, serious: 420, moderate: 336, mild: 80 } },
      { type: 'marine_debris', count: 1890, percentage: 22.4, trend: 'up', severity: { critical: 95, severe: 283, serious: 567, moderate: 756, mild: 189 } },
      { type: 'illegal_fishing', count: 1260, percentage: 14.9, trend: 'down', severity: { critical: 189, severe: 315, serious: 378, moderate: 315, mild: 63 } },
      { type: 'water_pollution', count: 700, percentage: 8.3, trend: 'stable', severity: { critical: 105, severe: 154, serious: 210, moderate: 175, mild: 56 } }
    ],
    severityBreakdown: [
      { level: 'Critical', count: 854, percentage: 10.1, avgResponseTime: 1.2 },
      { level: 'Severe', count: 1834, percentage: 21.8, avgResponseTime: 2.1 },
      { level: 'Serious', count: 2442, percentage: 29.0, avgResponseTime: 3.8 },
      { level: 'Moderate', count: 2472, percentage: 29.3, avgResponseTime: 6.2 },
      { level: 'Mild', count: 818, percentage: 9.7, avgResponseTime: 12.5 }
    ],
    geographicData: [
      { region: 'North Coast', reports: 2105, trend: 12.5, coordinates: [36.7783, -119.4179] },
      { region: 'Central Coast', reports: 1890, trend: 8.3, coordinates: [35.3738, -120.7463] },
      { region: 'South Coast', reports: 2420, trend: 15.2, coordinates: [33.7701, -118.1937] },
      { region: 'Bay Area', reports: 1580, trend: 6.8, coordinates: [37.7749, -122.4194] },
      { region: 'Inland Waters', reports: 425, trend: -2.1, coordinates: [38.5816, -121.4944] }
    ],
    communityEngagement: {
      totalMembers: 3420,
      activeMembers: 1250,
      contributionScore: 72.5,
      verificationAccuracy: 74.1
    },
    seasonalTrends: [
      { season: 'Spring', reports: 2180, dominantHazards: ['coastal_erosion', 'marine_debris'], avgSeverity: 2.8, responseTime: 4.2 },
      { season: 'Summer', reports: 3300, dominantHazards: ['oil_spill', 'marine_debris'], avgSeverity: 3.1, responseTime: 3.4 },
      { season: 'Fall', reports: 1510, dominantHazards: ['illegal_fishing', 'water_pollution'], avgSeverity: 2.5, responseTime: 4.1 },
      { season: 'Winter', reports: 1430, dominantHazards: ['coastal_erosion', 'oil_spill'], avgSeverity: 2.9, responseTime: 5.1 }
    ]
  },
  {
    year: 2021,
    totalReports: 9840,
    verifiedReports: 7562,
    activeUsers: 1680,
    responseTime: 3.9,
    monthlyData: [
      { month: 'January', monthNumber: 1, reports: 720, verified: 565, rejected: 155, users: 125, avgResponseTime: 4.2, accuracy: 78.5 },
      { month: 'February', monthNumber: 2, reports: 680, verified: 538, rejected: 142, users: 135, avgResponseTime: 3.8, accuracy: 79.1 },
      { month: 'March', monthNumber: 3, reports: 890, verified: 712, rejected: 178, users: 148, avgResponseTime: 3.5, accuracy: 80.0 },
      { month: 'April', monthNumber: 4, reports: 1050, verified: 857, rejected: 193, users: 162, avgResponseTime: 3.2, accuracy: 81.6 },
      { month: 'May', monthNumber: 5, reports: 1120, verified: 924, rejected: 196, users: 175, avgResponseTime: 2.9, accuracy: 82.5 },
      { month: 'June', monthNumber: 6, reports: 1240, verified: 1041, rejected: 199, users: 189, avgResponseTime: 2.6, accuracy: 83.9 },
      { month: 'July', monthNumber: 7, reports: 1380, verified: 1173, rejected: 207, users: 198, avgResponseTime: 2.4, accuracy: 85.0 },
      { month: 'August', monthNumber: 8, reports: 1290, verified: 1103, rejected: 187, users: 192, avgResponseTime: 2.7, accuracy: 85.5 },
      { month: 'September', monthNumber: 9, reports: 1150, verified: 966, rejected: 184, users: 180, avgResponseTime: 3.1, accuracy: 84.0 },
      { month: 'October', monthNumber: 10, reports: 950, verified: 779, rejected: 171, users: 165, avgResponseTime: 3.5, accuracy: 82.0 },
      { month: 'November', monthNumber: 11, reports: 820, verified: 648, rejected: 172, users: 152, avgResponseTime: 3.9, accuracy: 79.0 },
      { month: 'December', monthNumber: 12, reports: 540, verified: 418, rejected: 122, users: 139, avgResponseTime: 4.1, accuracy: 77.4 }
    ],
    hazardTypes: [
      { type: 'coastal_erosion', count: 3280, percentage: 33.3, trend: 'up', severity: { critical: 164, severe: 656, serious: 984, moderate: 1148, mild: 328 } },
      { type: 'marine_debris', count: 2340, percentage: 23.8, trend: 'up', severity: { critical: 117, severe: 351, serious: 702, moderate: 936, mild: 234 } },
      { type: 'oil_spill', count: 1970, percentage: 20.0, trend: 'up', severity: { critical: 394, severe: 591, serious: 492, moderate: 394, mild: 99 } },
      { type: 'illegal_fishing', count: 1380, percentage: 14.0, trend: 'up', severity: { critical: 207, severe: 345, serious: 414, moderate: 345, mild: 69 } },
      { type: 'water_pollution', count: 870, percentage: 8.8, trend: 'up', severity: { critical: 130, severe: 191, serious: 261, moderate: 217, mild: 71 } }
    ],
    severityBreakdown: [
      { level: 'Critical', count: 1012, percentage: 10.3, avgResponseTime: 0.9 },
      { level: 'Severe', count: 2134, percentage: 21.7, avgResponseTime: 1.8 },
      { level: 'Serious', count: 2853, percentage: 29.0, avgResponseTime: 3.2 },
      { level: 'Moderate', count: 3040, percentage: 30.9, avgResponseTime: 5.1 },
      { level: 'Mild', count: 801, percentage: 8.1, avgResponseTime: 10.2 }
    ],
    geographicData: [
      { region: 'North Coast', reports: 2460, trend: 16.9, coordinates: [36.7783, -119.4179] },
      { region: 'Central Coast', reports: 2210, trend: 16.9, coordinates: [35.3738, -120.7463] },
      { region: 'South Coast', reports: 2950, trend: 21.9, coordinates: [33.7701, -118.1937] },
      { region: 'Bay Area', reports: 1890, trend: 19.6, coordinates: [37.7749, -122.4194] },
      { region: 'Inland Waters', reports: 330, trend: -22.4, coordinates: [38.5816, -121.4944] }
    ],
    communityEngagement: {
      totalMembers: 4680,
      activeMembers: 1680,
      contributionScore: 79.2,
      verificationAccuracy: 81.5
    },
    seasonalTrends: [
      { season: 'Spring', reports: 2560, dominantHazards: ['coastal_erosion', 'marine_debris'], avgSeverity: 3.0, responseTime: 3.2 },
      { season: 'Summer', reports: 3910, dominantHazards: ['marine_debris', 'oil_spill'], avgSeverity: 3.3, responseTime: 2.6 },
      { season: 'Fall', reports: 1850, dominantHazards: ['illegal_fishing', 'water_pollution'], avgSeverity: 2.7, responseTime: 3.5 },
      { season: 'Winter', reports: 1520, dominantHazards: ['coastal_erosion', 'oil_spill'], avgSeverity: 3.1, responseTime: 4.3 }
    ]
  },
  {
    year: 2022,
    totalReports: 12680,
    verifiedReports: 10144,
    activeUsers: 2340,
    responseTime: 3.1,
    monthlyData: [
      { month: 'January', monthNumber: 1, reports: 890, verified: 747, rejected: 143, users: 180, avgResponseTime: 3.5, accuracy: 83.9 },
      { month: 'February', monthNumber: 2, reports: 820, verified: 697, rejected: 123, users: 195, avgResponseTime: 3.2, accuracy: 85.0 },
      { month: 'March', monthNumber: 3, reports: 1120, verified: 963, rejected: 157, users: 210, avgResponseTime: 2.9, accuracy: 86.0 },
      { month: 'April', monthNumber: 4, reports: 1340, verified: 1166, rejected: 174, users: 225, avgResponseTime: 2.6, accuracy: 87.0 },
      { month: 'May', monthNumber: 5, reports: 1450, verified: 1276, rejected: 174, users: 240, avgResponseTime: 2.3, accuracy: 88.0 },
      { month: 'June', monthNumber: 6, reports: 1580, verified: 1390, rejected: 190, users: 255, avgResponseTime: 2.1, accuracy: 87.9 },
      { month: 'July', monthNumber: 7, reports: 1720, verified: 1532, rejected: 188, users: 268, avgResponseTime: 1.9, accuracy: 89.1 },
      { month: 'August', monthNumber: 8, reports: 1650, verified: 1485, rejected: 165, users: 262, avgResponseTime: 2.2, accuracy: 90.0 },
      { month: 'September', monthNumber: 9, reports: 1480, verified: 1295, rejected: 185, users: 250, avgResponseTime: 2.5, accuracy: 87.5 },
      { month: 'October', monthNumber: 10, reports: 1230, verified: 1054, rejected: 176, users: 235, avgResponseTime: 2.8, accuracy: 85.7 },
      { month: 'November', monthNumber: 11, reports: 980, verified: 823, rejected: 157, users: 220, avgResponseTime: 3.1, accuracy: 84.0 },
      { month: 'December', monthNumber: 12, reports: 1080, verified: 906, rejected: 174, users: 210, avgResponseTime: 3.3, accuracy: 83.9 }
    ],
    hazardTypes: [
      { type: 'marine_debris', count: 3840, percentage: 30.3, trend: 'up', severity: { critical: 192, severe: 576, serious: 1152, moderate: 1536, mild: 384 } },
      { type: 'coastal_erosion', count: 3550, percentage: 28.0, trend: 'up', severity: { critical: 178, severe: 710, serious: 1065, moderate: 1278, mild: 319 } },
      { type: 'oil_spill', count: 2280, percentage: 18.0, trend: 'up', severity: { critical: 456, severe: 684, serious: 570, moderate: 456, mild: 114 } },
      { type: 'illegal_fishing', count: 1770, percentage: 14.0, trend: 'up', severity: { critical: 265, severe: 442, serious: 531, moderate: 442, mild: 90 } },
      { type: 'water_pollution', count: 1240, percentage: 9.8, trend: 'up', severity: { critical: 186, severe: 273, serious: 372, moderate: 310, mild: 99 } }
    ],
    severityBreakdown: [
      { level: 'Critical', count: 1277, percentage: 10.1, avgResponseTime: 0.7 },
      { level: 'Severe', count: 2685, percentage: 21.2, avgResponseTime: 1.5 },
      { level: 'Serious', count: 3690, percentage: 29.1, avgResponseTime: 2.8 },
      { level: 'Moderate', count: 4022, percentage: 31.7, avgResponseTime: 4.2 },
      { level: 'Mild', count: 1006, percentage: 7.9, avgResponseTime: 8.9 }
    ],
    geographicData: [
      { region: 'North Coast', reports: 3170, trend: 28.9, coordinates: [36.7783, -119.4179] },
      { region: 'Central Coast', reports: 2840, trend: 28.5, coordinates: [35.3738, -120.7463] },
      { region: 'South Coast', reports: 3800, trend: 28.8, coordinates: [33.7701, -118.1937] },
      { region: 'Bay Area', reports: 2540, trend: 34.4, coordinates: [37.7749, -122.4194] },
      { region: 'Inland Waters', reports: 330, trend: 0.0, coordinates: [38.5816, -121.4944] }
    ],
    communityEngagement: {
      totalMembers: 6240,
      activeMembers: 2340,
      contributionScore: 84.7,
      verificationAccuracy: 87.2
    },
    seasonalTrends: [
      { season: 'Spring', reports: 3310, dominantHazards: ['coastal_erosion', 'marine_debris'], avgSeverity: 3.2, responseTime: 2.6 },
      { season: 'Summer', reports: 4950, dominantHazards: ['marine_debris', 'oil_spill'], avgSeverity: 3.4, responseTime: 2.1 },
      { season: 'Fall', reports: 2410, dominantHazards: ['illegal_fishing', 'water_pollution'], avgSeverity: 2.9, responseTime: 2.8 },
      { season: 'Winter', reports: 2010, dominantHazards: ['coastal_erosion', 'oil_spill'], avgSeverity: 3.3, responseTime: 3.6 }
    ]
  },
  {
    year: 2023,
    totalReports: 15420,
    verifiedReports: 13087,
    activeUsers: 3120,
    responseTime: 2.4,
    monthlyData: [
      { month: 'January', monthNumber: 1, reports: 1080, verified: 950, rejected: 130, users: 245, avgResponseTime: 2.8, accuracy: 87.9 },
      { month: 'February', monthNumber: 2, reports: 1010, verified: 888, rejected: 122, users: 260, avgResponseTime: 2.5, accuracy: 87.9 },
      { month: 'March', monthNumber: 3, reports: 1350, verified: 1201, rejected: 149, users: 275, avgResponseTime: 2.2, accuracy: 88.9 },
      { month: 'April', monthNumber: 4, reports: 1620, verified: 1458, rejected: 162, users: 290, avgResponseTime: 1.9, accuracy: 90.0 },
      { month: 'May', monthNumber: 5, reports: 1750, verified: 1592, rejected: 158, users: 305, avgResponseTime: 1.7, accuracy: 91.0 },
      { month: 'June', monthNumber: 6, reports: 1890, verified: 1738, rejected: 152, users: 320, avgResponseTime: 1.5, accuracy: 91.9 },
      { month: 'July', monthNumber: 7, reports: 2040, verified: 1877, rejected: 163, users: 335, avgResponseTime: 1.4, accuracy: 92.0 },
      { month: 'August', monthNumber: 8, reports: 1950, verified: 1794, rejected: 156, users: 328, avgResponseTime: 1.6, accuracy: 92.0 },
      { month: 'September', monthNumber: 9, reports: 1760, verified: 1584, rejected: 176, users: 315, avgResponseTime: 1.8, accuracy: 90.0 },
      { month: 'October', monthNumber: 10, reports: 1480, verified: 1302, rejected: 178, users: 300, avgResponseTime: 2.1, accuracy: 88.0 },
      { month: 'November', monthNumber: 11, reports: 1180, verified: 1003, rejected: 177, users: 285, avgResponseTime: 2.4, accuracy: 85.0 },
      { month: 'December', monthNumber: 12, reports: 1320, verified: 1122, rejected: 198, users: 275, avgResponseTime: 2.6, accuracy: 85.0 }
    ],
    hazardTypes: [
      { type: 'marine_debris', count: 4780, percentage: 31.0, trend: 'up', severity: { critical: 239, severe: 717, serious: 1434, moderate: 1912, mild: 478 } },
      { type: 'coastal_erosion', count: 4010, percentage: 26.0, trend: 'up', severity: { critical: 200, severe: 802, serious: 1203, moderate: 1443, mild: 362 } },
      { type: 'oil_spill', count: 2780, percentage: 18.0, trend: 'up', severity: { critical: 556, severe: 834, serious: 695, moderate: 556, mild: 139 } },
      { type: 'illegal_fishing', count: 2160, percentage: 14.0, trend: 'up', severity: { critical: 324, severe: 540, serious: 648, moderate: 540, mild: 108 } },
      { type: 'water_pollution', count: 1690, percentage: 11.0, trend: 'up', severity: { critical: 253, severe: 372, serious: 507, moderate: 422, mild: 136 } }
    ],
    severityBreakdown: [
      { level: 'Critical', count: 1572, percentage: 10.2, avgResponseTime: 0.5 },
      { level: 'Severe', count: 3265, percentage: 21.2, avgResponseTime: 1.2 },
      { level: 'Serious', count: 4487, percentage: 29.1, avgResponseTime: 2.1 },
      { level: 'Moderate', count: 4873, percentage: 31.6, avgResponseTime: 3.2 },
      { level: 'Mild', count: 1223, percentage: 7.9, avgResponseTime: 6.8 }
    ],
    geographicData: [
      { region: 'North Coast', reports: 3850, trend: 21.5, coordinates: [36.7783, -119.4179] },
      { region: 'Central Coast', reports: 3460, trend: 21.8, coordinates: [35.3738, -120.7463] },
      { region: 'South Coast', reports: 4620, trend: 21.6, coordinates: [33.7701, -118.1937] },
      { region: 'Bay Area', reports: 3180, trend: 25.2, coordinates: [37.7749, -122.4194] },
      { region: 'Inland Waters', reports: 310, trend: -6.1, coordinates: [38.5816, -121.4944] }
    ],
    communityEngagement: {
      totalMembers: 8340,
      activeMembers: 3120,
      contributionScore: 89.2,
      verificationAccuracy: 91.5
    },
    seasonalTrends: [
      { season: 'Spring', reports: 4020, dominantHazards: ['coastal_erosion', 'marine_debris'], avgSeverity: 3.4, responseTime: 2.0 },
      { season: 'Summer', reports: 5880, dominantHazards: ['marine_debris', 'oil_spill'], avgSeverity: 3.6, responseTime: 1.5 },
      { season: 'Fall', reports: 2940, dominantHazards: ['illegal_fishing', 'water_pollution'], avgSeverity: 3.1, responseTime: 2.1 },
      { season: 'Winter', reports: 2580, dominantHazards: ['coastal_erosion', 'oil_spill'], avgSeverity: 3.5, responseTime: 2.8 }
    ]
  },
  {
    year: 2024,
    totalReports: 18750,
    verifiedReports: 16875,
    activeUsers: 4200,
    responseTime: 1.8,
    monthlyData: [
      { month: 'January', monthNumber: 1, reports: 1320, verified: 1214, rejected: 106, users: 320, avgResponseTime: 2.1, accuracy: 92.0 },
      { month: 'February', monthNumber: 2, reports: 1240, verified: 1147, rejected: 93, users: 335, avgResponseTime: 1.9, accuracy: 92.5 },
      { month: 'March', monthNumber: 3, reports: 1640, verified: 1525, rejected: 115, users: 350, avgResponseTime: 1.7, accuracy: 93.0 },
      { month: 'April', monthNumber: 4, reports: 1980, verified: 1841, rejected: 139, users: 365, avgResponseTime: 1.5, accuracy: 93.0 },
      { month: 'May', monthNumber: 5, reports: 2140, verified: 2009, rejected: 131, users: 380, avgResponseTime: 1.3, accuracy: 93.9 },
      { month: 'June', monthNumber: 6, reports: 2280, verified: 2166, rejected: 114, users: 395, avgResponseTime: 1.2, accuracy: 95.0 },
      { month: 'July', monthNumber: 7, reports: 2450, verified: 2353, rejected: 97, users: 410, avgResponseTime: 1.1, accuracy: 96.0 },
      { month: 'August', monthNumber: 8, reports: 2340, verified: 2246, rejected: 94, users: 405, avgResponseTime: 1.3, accuracy: 96.0 },
      { month: 'September', monthNumber: 9, reports: 2120, verified: 2003, rejected: 117, users: 395, avgResponseTime: 1.5, accuracy: 94.5 },
      { month: 'October', monthNumber: 10, reports: 1780, verified: 1670, rejected: 110, users: 380, avgResponseTime: 1.7, accuracy: 93.8 },
      { month: 'November', monthNumber: 11, reports: 1420, verified: 1306, rejected: 114, users: 365, avgResponseTime: 1.9, accuracy: 92.0 },
      { month: 'December', monthNumber: 12, reports: 1580, verified: 1449, rejected: 131, users: 355, avgResponseTime: 2.0, accuracy: 91.7 }
    ],
    hazardTypes: [
      { type: 'marine_debris', count: 5810, percentage: 31.0, trend: 'stable', severity: { critical: 291, severe: 872, serious: 1743, moderate: 2324, mild: 580 } },
      { type: 'coastal_erosion', count: 4690, percentage: 25.0, trend: 'up', severity: { critical: 234, severe: 938, serious: 1407, moderate: 1688, mild: 423 } },
      { type: 'oil_spill', count: 3380, percentage: 18.0, trend: 'up', severity: { critical: 676, severe: 1014, serious: 845, moderate: 676, mild: 169 } },
      { type: 'illegal_fishing', count: 2630, percentage: 14.0, trend: 'up', severity: { critical: 394, severe: 657, serious: 789, moderate: 657, mild: 133 } },
      { type: 'water_pollution', count: 2240, percentage: 12.0, trend: 'up', severity: { critical: 336, severe: 493, serious: 672, moderate: 560, mild: 179 } }
    ],
    severityBreakdown: [
      { level: 'Critical', count: 1931, percentage: 10.3, avgResponseTime: 0.4 },
      { level: 'Severe', count: 3974, percentage: 21.2, avgResponseTime: 0.9 },
      { level: 'Serious', count: 5456, percentage: 29.1, avgResponseTime: 1.6 },
      { level: 'Moderate', count: 5905, percentage: 31.5, avgResponseTime: 2.4 },
      { level: 'Mild', count: 1484, percentage: 7.9, avgResponseTime: 5.2 }
    ],
    geographicData: [
      { region: 'North Coast', reports: 4690, trend: 21.8, coordinates: [36.7783, -119.4179] },
      { region: 'Central Coast', reports: 4220, trend: 22.0, coordinates: [35.3738, -120.7463] },
      { region: 'South Coast', reports: 5630, trend: 21.9, coordinates: [33.7701, -118.1937] },
      { region: 'Bay Area', reports: 3890, trend: 22.3, coordinates: [37.7749, -122.4194] },
      { region: 'Inland Waters', reports: 320, trend: 3.2, coordinates: [38.5816, -121.4944] }
    ],
    communityEngagement: {
      totalMembers: 11200,
      activeMembers: 4200,
      contributionScore: 93.8,
      verificationAccuracy: 94.7
    },
    seasonalTrends: [
      { season: 'Spring', reports: 4900, dominantHazards: ['coastal_erosion', 'marine_debris'], avgSeverity: 3.6, responseTime: 1.5 },
      { season: 'Summer', reports: 7070, dominantHazards: ['marine_debris', 'oil_spill'], avgSeverity: 3.8, responseTime: 1.2 },
      { season: 'Fall', reports: 3560, dominantHazards: ['illegal_fishing', 'water_pollution'], avgSeverity: 3.3, responseTime: 1.6 },
      { season: 'Winter', reports: 3220, dominantHazards: ['coastal_erosion', 'oil_spill'], avgSeverity: 3.7, responseTime: 2.1 }
    ]
  },
  {
    year: 2025,
    totalReports: 21340,
    verifiedReports: 19673,
    activeUsers: 5680,
    responseTime: 1.4,
    monthlyData: [
      { month: 'January', monthNumber: 1, reports: 1580, verified: 1501, rejected: 79, users: 420, avgResponseTime: 1.6, accuracy: 95.0 },
      { month: 'February', monthNumber: 2, reports: 1480, verified: 1407, rejected: 73, users: 445, avgResponseTime: 1.5, accuracy: 95.1 },
      { month: 'March', monthNumber: 3, reports: 1920, verified: 1843, rejected: 77, users: 470, avgResponseTime: 1.3, accuracy: 96.0 },
      { month: 'April', monthNumber: 4, reports: 2340, verified: 2247, rejected: 93, users: 495, avgResponseTime: 1.2, accuracy: 96.0 },
      { month: 'May', monthNumber: 5, reports: 2520, verified: 2419, rejected: 101, users: 520, avgResponseTime: 1.0, accuracy: 96.0 },
      { month: 'June', monthNumber: 6, reports: 2680, verified: 2599, rejected: 81, users: 545, avgResponseTime: 0.9, accuracy: 97.0 },
      { month: 'July', monthNumber: 7, reports: 2880, verified: 2822, rejected: 58, users: 570, avgResponseTime: 0.8, accuracy: 98.0 },
      { month: 'August', monthNumber: 8, reports: 2750, verified: 2695, rejected: 55, users: 562, avgResponseTime: 1.0, accuracy: 98.0 },
      { month: 'September', monthNumber: 9, reports: 2490, verified: 2391, rejected: 99, users: 550, avgResponseTime: 1.2, accuracy: 96.0 },
      { month: 'October', monthNumber: 10, reports: 2090, verified: 1986, rejected: 104, users: 530, avgResponseTime: 1.4, accuracy: 95.0 },
      { month: 'November', monthNumber: 11, reports: 1670, verified: 1570, rejected: 100, users: 510, avgResponseTime: 1.6, accuracy: 94.0 },
      { month: 'December', monthNumber: 12, reports: 1950, verified: 1835, rejected: 115, users: 495, avgResponseTime: 1.7, accuracy: 94.1 }
    ],
    hazardTypes: [
      { type: 'marine_debris', count: 6620, percentage: 31.0, trend: 'stable', severity: { critical: 331, severe: 993, serious: 1986, moderate: 2648, mild: 662 } },
      { type: 'coastal_erosion', count: 5340, percentage: 25.0, trend: 'up', severity: { critical: 267, severe: 1068, serious: 1602, moderate: 1922, mild: 481 } },
      { type: 'oil_spill', count: 3840, percentage: 18.0, trend: 'stable', severity: { critical: 768, severe: 1152, serious: 960, moderate: 768, mild: 192 } },
      { type: 'illegal_fishing', count: 2990, percentage: 14.0, trend: 'up', severity: { critical: 448, severe: 747, serious: 897, moderate: 747, mild: 151 } },
      { type: 'water_pollution', count: 2550, percentage: 12.0, trend: 'stable', severity: { critical: 383, severe: 561, serious: 765, moderate: 638, mild: 203 } }
    ],
    severityBreakdown: [
      { level: 'Critical', count: 2197, percentage: 10.3, avgResponseTime: 0.3 },
      { level: 'Severe', count: 4521, percentage: 21.2, avgResponseTime: 0.7 },
      { level: 'Serious', count: 6210, percentage: 29.1, avgResponseTime: 1.2 },
      { level: 'Moderate', count: 6723, percentage: 31.5, avgResponseTime: 1.8 },
      { level: 'Mild', count: 1689, percentage: 7.9, avgResponseTime: 3.9 }
    ],
    geographicData: [
      { region: 'North Coast', reports: 5340, trend: 13.9, coordinates: [36.7783, -119.4179] },
      { region: 'Central Coast', reports: 4800, trend: 13.7, coordinates: [35.3738, -120.7463] },
      { region: 'South Coast', reports: 6410, trend: 13.9, coordinates: [33.7701, -118.1937] },
      { region: 'Bay Area', reports: 4430, trend: 13.9, coordinates: [37.7749, -122.4194] },
      { region: 'Inland Waters', reports: 360, trend: 12.5, coordinates: [38.5816, -121.4944] }
    ],
    communityEngagement: {
      totalMembers: 15200,
      activeMembers: 5680,
      contributionScore: 96.2,
      verificationAccuracy: 97.1
    },
    seasonalTrends: [
      { season: 'Spring', reports: 5580, dominantHazards: ['coastal_erosion', 'marine_debris'], avgSeverity: 3.8, responseTime: 1.2 },
      { season: 'Summer', reports: 8050, dominantHazards: ['marine_debris', 'oil_spill'], avgSeverity: 4.0, responseTime: 0.9 },
      { season: 'Fall', reports: 4050, dominantHazards: ['illegal_fishing', 'water_pollution'], avgSeverity: 3.5, responseTime: 1.3 },
      { season: 'Winter', reports: 3660, dominantHazards: ['coastal_erosion', 'oil_spill'], avgSeverity: 3.9, responseTime: 1.8 }
    ]
  }
];

// Utility functions for analytics calculations
export const getYearData = (year: number): YearlyAnalytics | undefined => {
  return yearlyAnalyticsData.find(data => data.year === year);
};

export const getAvailableYears = (): number[] => {
  return yearlyAnalyticsData.map(data => data.year).sort((a, b) => b - a);
};

export const calculateYearOverYearGrowth = (currentYear: number, metric: keyof YearlyAnalytics): number | null => {
  const current = getYearData(currentYear);
  const previous = getYearData(currentYear - 1);
  
  if (!current || !previous) return null;
  
  const currentValue = current[metric] as number;
  const previousValue = previous[metric] as number;
  
  if (typeof currentValue !== 'number' || typeof previousValue !== 'number') return null;
  
  return ((currentValue - previousValue) / previousValue) * 100;
};

export const getTrendDirection = (growth: number | null): 'up' | 'down' | 'stable' => {
  if (growth === null) return 'stable';
  if (growth > 5) return 'up';
  if (growth < -5) return 'down';
  return 'stable';
};

export const getSeasonalComparison = (year1: number, year2: number) => {
  const data1 = getYearData(year1);
  const data2 = getYearData(year2);
  
  if (!data1 || !data2) return null;
  
  return {
    spring: {
      year1: data1.seasonalTrends.find(s => s.season === 'Spring'),
      year2: data2.seasonalTrends.find(s => s.season === 'Spring'),
    },
    summer: {
      year1: data1.seasonalTrends.find(s => s.season === 'Summer'),
      year2: data2.seasonalTrends.find(s => s.season === 'Summer'),
    },
    fall: {
      year1: data1.seasonalTrends.find(s => s.season === 'Fall'),
      year2: data2.seasonalTrends.find(s => s.season === 'Fall'),
    },
    winter: {
      year1: data1.seasonalTrends.find(s => s.season === 'Winter'),
      year2: data2.seasonalTrends.find(s => s.season === 'Winter'),
    }
  };
};
