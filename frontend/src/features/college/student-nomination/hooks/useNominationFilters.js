import { useState, useMemo } from 'react'

const useNominationFilters = (students = []) => {
  const [search, setSearch] = useState('')
  const [company, setCompany] = useState('All')
  const [department, setDepartment] = useState('All')
  const [status, setStatus] = useState('All')
  const [batch, setBatch] = useState('All')

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !search ||
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.enrollmentNo?.toLowerCase().includes(search.toLowerCase()) ||
        s.enrollment_no?.toLowerCase().includes(search.toLowerCase())

      const matchCompany = company === 'All' || s.company === company || s.company_name === company
      const matchDept = department === 'All' || s.department === department
      const matchStatus = status === 'All' || s.status === status || s.placementStatus === status
      const matchBatch = batch === 'All' || s.batch === batch

      return matchSearch && matchCompany && matchDept && matchStatus && matchBatch
    })
  }, [students, search, company, department, status, batch])

  const resetFilters = () => {
    setSearch('')
    setCompany('All')
    setDepartment('All')
    setStatus('All')
    setBatch('All')
  }

  return {
    search, setSearch,
    company, setCompany,
    department, setDepartment,
    status, setStatus,
    batch, setBatch,
    filtered,
    resetFilters,
  }
}

export default useNominationFilters