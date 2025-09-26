"use client"

import { useState } from "react"
import "./CreateDepartement.css"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function CreateDepartement() {
  const [formData, setFormData] = useState({
    departmentName: "",
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
      const res = await fetch("http://localhost:5000/api/auth/register-chef", {
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
          departmentName: formData.departmentName,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la création")
      }

      alert("✅ Chef de département créé avec succès !")
      setFormData({
        departmentName: "",
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
      <h2>Créer un département</h2>
      <div className="back-button" onClick={() => navigate("/Home")}>
        <FaArrowLeft /> <span>Retour</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="department">Département</label>
          <select
            name="departmentName"
            id="department"
            value={formData.departmentName}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner --</option>
            <option value="Mathématiques">Mathématiques</option>
            <option value="Physique">Physique</option>
            <option value="Chimie">Chimie</option>
            <option value="Informatique">Informatique</option>
            <option value="Biologie">Biologie</option>
            <option value="Langues Étrangères">Langues Étrangères</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>
          <input
            type="text"
            name="firstName"
            placeholder="Entrer le prénom"
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
            placeholder="Entrer le nom"
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
            placeholder="Entrer l'email"
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
            placeholder="Entrer le mot de passe"
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
