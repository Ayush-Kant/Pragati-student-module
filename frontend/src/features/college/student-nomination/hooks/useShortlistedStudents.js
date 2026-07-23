import { useState, useEffect, useCallback } from 'react'
import { getShortlistedStudents } from '../services/studentNominationService.js'

const useShortlistedStudents = () => {
  const [shortlistedStudents, setShortlistedStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchShortlisted = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getShortlistedStudents(params)
      if (res.success) setShortlistedStudents(res.data || [])
      else setError(res.message)
    } catch {
      setError('Failed to load shortlisted students')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchShortlisted()
  }, [fetchShortlisted])

  return {
    shortlistedStudents,
    loading,
    error,
    fetchShortlisted,
  }
}

export default useShortlistedStudents