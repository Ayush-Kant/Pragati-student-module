import api from '../../../../services/api.js'
import {
  eligibleStudents,
  nominatedStudents,
} from '../types/studentNominationDummyData.js'

const USE_DUMMY = false

export const getEligibleStudents = async (params = {}) => {
  if (USE_DUMMY) return { success: true, data: eligibleStudents }
  try {
    const response = await api.get('/nominations/eligible', { params })
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (err) {
    console.warn('API failed, using dummy data')
    return { success: true, data: eligibleStudents }
  }
}

export const getNominations = async (params = {}) => {
  if (USE_DUMMY) return { success: true, data: nominatedStudents }
  try {
    const response = await api.get('/nominations', { params })
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (err) {
    console.warn('API failed, using dummy data')
    return { success: true, data: nominatedStudents }
  }
}

export const getShortlistedStudents = async (params = {}) => {
  try {
    const response = await api.get('/shortlists', { params })
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    }
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to fetch shortlists', data: [] }
  }
}

export const nominateStudent = async (data) => {
  try {
    const response = await api.post('/nominations', data)
    return { success: true, data: response.data.data }
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to nominate student' }
  }
}

export const updateNomination = async (id, data) => {
  try {
    const response = await api.put(`/nominations/${id}`, data)
    return { success: true, data: response.data.data }
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to update nomination' }
  }
}

export const removeNomination = async (id) => {
  try {
    const response = await api.delete(`/nominations/${id}`)
    return { success: true, message: response.data.message }
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to remove nomination' }
  }
}

export const getCompanyShortlist = async (companyId, params = {}) => {
  try {
    const response = await api.get(`/shortlists/company/${companyId}`, { params })
    return { success: true, data: response.data.data }
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to fetch company shortlist', data: [] }
  }
}

export const getNominationStatistics = async () => {
  try {
    const response = await api.get('/nominations/statistics')
    return { success: true, data: response.data.data }
  } catch (err) {
    return { success: false, data: null }
  }
}