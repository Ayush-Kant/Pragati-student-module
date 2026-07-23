import {
  getNominationStatisticsService,
  getCompanyStatisticsService,
  getDepartmentStatisticsService,
} from '../services/collegeNominationStatistics.service.js'
import { successResponse } from '../utils/responseHandler.js'

export const getNominationStatistics = async (req, res, next) => {
  try {
    const stats = await getNominationStatisticsService()
    return successResponse(res, stats, 'Statistics fetched successfully')
  } catch (err) {
    next(err)
  }
}

export const getCompanyStatistics = async (req, res, next) => {
  try {
    const stats = await getCompanyStatisticsService()
    return successResponse(res, stats, 'Company statistics fetched successfully')
  } catch (err) {
    next(err)
  }
}

export const getDepartmentStatistics = async (req, res, next) => {
  try {
    const stats = await getDepartmentStatisticsService()
    return successResponse(res, stats, 'Department statistics fetched successfully')
  } catch (err) {
    next(err)
  }
}