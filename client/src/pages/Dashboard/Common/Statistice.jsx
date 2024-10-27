import React from 'react'
import useRole from '../../../hooks/useRole'
import AdminStatistics from '../Admin/AdminStatistics'

const Statistice = () => {
  const [role, isLoading] = useRole()
  return (
    <>
      {role === "admin" && <AdminStatistics />}
    </>
  )
}

export default Statistice
