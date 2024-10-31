import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'

const LoginRoutes = () => {
  return (
    <div className='w-full h-screen'>
        <Routes>
            <Route path="login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
    </div>
  )
}

export default LoginRoutes