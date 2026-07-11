export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message)

  if (err.message === 'Student is not eligible for nomination')
    return res.status(400).json({ success: false, message: err.message })

  if (err.message === 'Nomination not found')
    return res.status(404).json({ success: false, message: err.message })

  if (err.message === 'Shortlist entry not found')
    return res.status(404).json({ success: false, message: err.message })

  if (err.code === '23505')
    return res.status(409).json({ success: false, message: 'Duplicate entry — student already nominated for this company' })

  return res.status(500).json({ success: false, message: 'Internal server error' })
}