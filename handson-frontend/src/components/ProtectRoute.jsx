import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectRoute = ({children}) => {
    const navigate = useNavigate();
useEffect(() => {
    const tokenId = localStorage.getItem("token");
    if (tokenId == null) {
        alert('not found')
        navigate('/')  
    }
}, []);
  return (
    <div>
      {
        children
      }
    </div>
  )
}

export default ProtectRoute
