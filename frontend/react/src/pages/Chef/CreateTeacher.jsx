"use client"

import { useState } from "react"
import "./CreateTeacher.css"
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaSpinner } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function CreateTeacher() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("Le prénom est requis")
      return false
    }
    if (!formData.lastName.trim()) {
      setError("Le nom est requis")
      return false
    }
    if (!formData.email.trim()) {
      setError("L'email est requis")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide")
      return false
    }
    if (!formData.password.trim()) {
      setError("Le mot de passe est requis")
      return false
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Réinitialiser les messages
    setError("")
    setSuccess(false)

    // Valider le formulaire
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("userToken")

      const response = await fetch("http://localhost:5000/api/auth/register-teacher", {
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création de l'enseignant")
      }

      // Succès
      setSuccess(true)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      })
    
    } catch (error) {
      console.error("❌ Erreur:", error)
      setError(error.message || "Une erreur est survenue lors de la création de l'enseignant")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-teacher-page">
      <div className="back-button" onClick={() => navigate("/Home")}>
        <FaArrowLeft /> <span>Retour</span>
      </div>

      <div className="form-container">
        <div className="form-header">
          <h1>Ajouter un enseignant</h1>
          <p>Créez un nouveau compte enseignant en remplissant le formulaire ci-dessous</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Enseignant créé avec succès ! Redirection en cours...</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="firstName">Prénom</label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Prénom"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="lastName">Nom</label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Nom"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Adresse email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@universite.fr"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 caractères"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="password-hint">Le mot de passe doit contenir au moins 6 caractères</div>
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner" /> Création en cours...
              </>
            ) : (
              "Créer le compte"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
