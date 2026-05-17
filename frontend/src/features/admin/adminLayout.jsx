import React from 'react'
import {Outlet} from 'react-router-dom'
import AdminNavbar from './adminNavbar/AdminNavbar'
import AdminSidebar from './adminSidebar/AdminSidebar'
import AdminFooter from './adminFooter/AdminFooter'

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar/>
      <AdminSidebar/>
      <main>
        <Outlet/>
      </main>
      <AdminFooter/>
    </div>
  )
}

export default AdminLayout
