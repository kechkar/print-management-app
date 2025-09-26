"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import rolesConfig from "../home/rolesConfig"
import Header from "../../components/Header"
import UserInfo from "../../components/UserInfo"
import { useAuth } from "../context/AuthContext"
import "./Home.css"

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      console.log("Redirection vers /loginAdmin")
      navigate("/loginAdmin")
    }
  }, [user, navigate])

  if (!user) {
    return <div className="loading">Chargement...</div>
  }

  const role = user.role
  const config = rolesConfig[role]

  return (
    <div className="home-container">
      <Header title="Accueil" />
      <UserInfo F_name={user.F_name} role={user.role} />

      <div className="cards-grid">
        {config.cards.map((card, index) => (
          <div
            key={index}
            className="card-modern"
            onClick={() => {
              console.log("Navigating to:", card.link)
              navigate(card.link)
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="card-image-wrapper">
              <img className="card-image" src={card.image || "/placeholder.svg"} alt={card.title} />
            </div>
            <h3 className="card-title">{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
