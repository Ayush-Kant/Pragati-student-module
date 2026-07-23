import {
  getNominationStatistics,
  getCompanyWiseStatistics,
  getDepartmentWiseStatistics,
} from '../models/collegeNominationStatistics.model.js'

export const getNominationStatisticsService = async () => {
  return await getNominationStatistics()
}

export const getCompanyStatisticsService = async () => {
  return await getCompanyWiseStatistics()
}

export const getDepartmentStatisticsService = async () => {
  return await getDepartmentWiseStatistics()
}