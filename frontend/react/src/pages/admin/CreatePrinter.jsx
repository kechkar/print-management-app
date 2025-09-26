"use client"

import { useState } from "react"
import "./CreatePrinter.css"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function CreatePrinter() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("userToken")

    try {
      const res = await fetch("http://localhost:5000/api/auth/register-imprimerie", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          F_name: formData.firstName,
          L_name: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la création")
      }

      alert("✅ Compte service d'impression créé avec succès !")
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      })
    } catch (error) {
      console.error("❌ Erreur :", error)
      alert(`Erreur : ${error.message}`)
    }
  }

  return (
    
    <div className="create-printer-form">
      <h2>Créer un compte pour le service d'impression</h2>
      <div className="back-button" onClick={() => navigate("/Home")}>
        <FaArrowLeft /> <span>Retour</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>
          <input
            type="text"
            name="firstName"
            placeholder="Entrer votre prénom"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Nom</label>
          <input
            type="text"
            name="lastName"
            placeholder="Entrer votre nom"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Entrer votre email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            name="password"
            placeholder="Entrer votre mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-button">
            Créer
          </button>
          
        </div>
      </form>
    </div>
  )
}
