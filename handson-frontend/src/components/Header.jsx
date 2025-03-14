import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const {user, logout} = useContext(AuthContext)
  const handleLogout = ()=>{
    logout()
    navigate('/')
  }
  return (
    <div className='flex justify-between items-center py-2'>
      <div className="logo md:text-4xl font-semibold text-green-500"><a href="/events">HandsOn</a></div>
      <div className="profile w-fit relative group">
        <img className='md:w-16 md:h-16 w-12 h-12 rounded-full' src={user?.profilePicture} alt="profile" />
        <div className="hidden absolute group-hover:block w-fit">
      <div className='bg-gray-100 px-2 rounded-md'><a href="/profile">Profile</a></div>
      <p onClick={handleLogout} className='bg-rose-100 cursor-pointer px-2 rounded-md'>Logout</p>
        </div>
      </div>
    </div>
  )
}

export default Header