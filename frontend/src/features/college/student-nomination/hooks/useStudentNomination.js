import { useState, useEffect, useCallback } from 'react'
import {
  getEligibleStudents,
  getNominations,
  nominateStudent,
  updateNomination,
  removeNomination,
} from '../services/studentNominationService.js'

const useStudentNomination = () => {
  const [eligibleStudents, setEligibleStudents] = useState([])
  const [nominatedStudents, setNominatedStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEligible = useCallback(async (params = {}) => {
    const res = await getEligibleStudents(params)
        if (res.success) {
            const mapped = (res.data || []).map(s => ({
            ...s,
            enrollmentNo: s.enrollment_no || s.enrollmentNo,
            placementStatus: s.placement_status || s.placementStatus,
            company: s.company_name || s.company || '—',
                    status: s.placement_status || 'Eligible',
                timeline: {
                nominated: s.nomination_date
                ? new Date(s.nomination_date).toLocaleDateString('en-IN')
                : '—'
            }
        }))
        setEligibleStudents(mapped)
        }
    }, [])

  const fetchNominated = useCallback(async (params = {}) => {
  const res = await getNominations(params)
  if (res.success) {
    const mapped = (res.data || []).map(n => ({
            ...n,
            enrollmentNo: n.enrollment_no || n.enrollmentNo,
            company: n.company_name || n.company,
            timeline: {
                nominated: n.nomination_date
                ? new Date(n.nomination_date).toLocaleDateString('en-IN')
                : '—'
            }
            }))
        setNominatedStudents(mapped)
        }
    }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([fetchEligible(), fetchNominated()])
    } catch {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [fetchEligible, fetchNominated])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const nominate = async (data) => {
    const res = await nominateStudent(data)
    if (res.success) await fetchAll()
    return res
  }

  const update = async (id, data) => {
    const res = await updateNomination(id, data)
    if (res.success) await fetchNominated()
    return res
  }

  const remove = async (id) => {
    const res = await removeNomination(id)
    if (res.success) await fetchNominated()
    return res
  }

  return {
    eligibleStudents,
    nominatedStudents,
    loading,
    error,
    fetchAll,
    nominate,
    update,
    remove,
  }
}

export default useStudentNomination