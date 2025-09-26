"use client"

import { useNavigate } from "react-router-dom"
import ProfilPic from "../assets/HomePagePics/profilPic.png"
import { LogOut, Bell, Mail, Calendar } from 'lucide-react'
import "./UserInfo.css"

const UserInfo = ({ F_name, role }) => {
  const navigate = useNavigate()
console.log(F_name  , role)
  const handleLogout = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userData")
    navigate("/login")
  }

  return (
    <div className="user-info-modern">
      <div className="user-info-content">
        <div className="user-profile-section">
          <div className="user-avatar-container">
            <img src={ProfilPic || "/placeholder.svg"} alt="Avatar" className="user-avatar" />
          </div>
          <div className="user-details">
            <h2 className="user-name">{F_name}</h2>
            <div className="user-role">{role}</div>
          </div>
        </div>
        
        <div className="user-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <Mail size={18} />
            </div>
            <div className="stat-info">
              <div className="stat-value">12</div>
              <div className="stat-label">Nouvelles requetes</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Bell size={18} />
            </div>
            <div className="stat-info">
              <div className="stat-value">5</div>
              <div className="stat-label">Alertes</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Calendar size={18} />
            </div>
            <div className="stat-info">
              <div className="stat-value">8</div>
              <div className="stat-label">Tâches</div>
            </div>
          </div>
        </div>
        
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}

export default UserInfo
