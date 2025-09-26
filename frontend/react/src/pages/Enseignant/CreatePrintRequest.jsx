"use client"
// const PrintRequest = require("../../../../../backend/models/PrintRequest");
import { useState } from "react"
import "./CreatePrintRequest.css"
import {
  FaHome,
  FaSpinner,
  FaArrowLeft,
  FaFileAlt,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function CreatePrintRequest() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    departmentName: "",
    teacherFirstName: "",
    teacherLastName: "",
    documentType: "",
    priority: "Normale",
    nombreExemplaires: 1,
    paperSize: "A4",
    colorMode: "Noir et blanc",
    doubleSided: false,
    submissionDateTime: "",
    
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.departmentName) {
      setError("Veuillez sélectionner un département");
      return;
    }
  
    setIsSubmitting(true);
    setError("");
  
    const token = localStorage.getItem("userToken");

    const teacherData = JSON.parse(localStorage.getItem("userData"));
    console.log(teacherData);

  
    const payload = {
      title: formData.title,
      description: formData.description,
      departmentName: formData.departmentName,
      teacherFirstName: teacherData.F_name,
      teacherLastName: teacherData.L_name,
      documentType: formData.documentType,
      priority: formData.priority,
      nombreExemplaires: formData.nombreExemplaires,
      paperSize: formData.paperSize,
      colorMode: formData.colorMode,
      doubleSided: formData.doubleSided,
      submissionDateTime: new Date().toISOString(), // à ajuster si besoin
    };
  
    try {
      const res = await fetch("http://localhost:5000/api/print-requests/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la soumission de la demande");
      }
  
      setSuccess(true);
      // setTimeout(() => {
      //   navigate("/my-requests");
      // }, 3000);
    } catch (error) {
      console.error("❌ Erreur :", error);
      setError(`Erreur : ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="create-print-request">
      <div className="page-header">
        <div className="header-content">
          <h2>Nouvelle Demande d'Impression</h2>
          <p>Remplissez ce formulaire pour soumettre une nouvelle demande d'impression</p>
        </div>
        <div className="header-actions">
          <button className="back-button" onClick={() => navigate("/Home")}>
            <FaArrowLeft /> Retour
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <FaCheckCircle className="success-icon" />
          <span>Demande d'impression soumise avec succès ! Redirection en cours...</span>
        </div>
      )}

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">
            <FaFileAlt className="section-icon" />
            <span>Informations générales</span>
          </h3>
          <div className="form-content">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                className="title-input"
                onChange={handleChange}
                placeholder="Détails supplémentaires sur votre demande d'impression"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                className="title-input"
                onChange={handleChange}
                placeholder="Titre de votre demande"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="departmentName">Département</label>
              <select
                id="departmentName"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionner un département --</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Physique">Physique</option>
                <option value="Chimie">Chimie</option>
                <option value="Informatique">Informatique</option>
                <option value="Biologie">Biologie</option>
                <option value="Langues Étrangères">Langues Étrangères</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="documentType">Type de document</label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionner un type de document --</option>
                <option value="Examen">Examen</option>
                <option value="Test">Test</option>
                <option value="Série de TD">Série de TD</option>
                <option value="Série de TP">Série de TP</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">
            <FaClipboardList className="section-icon" />
            <span>Options d'impression</span>
          </h3>
          <div className="form-content">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="copies">Nombre de copies</label>
                <input
  type="number"
  id="nombreExemplaires"
  name="nombreExemplaires"
  min="1"
  max="100"
  value={formData.nombreExemplaires}
  onChange={handleChange}
  required
/>

              </div>

              <div className="form-group">
                <label htmlFor="paperSize">Format de papier</label>
                <select id="paperSize" name="paperSize" value={formData.paperSize} onChange={handleChange} required>
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="A5">A5</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="colorMode">Mode de couleur</label>
                <select id="colorMode" name="colorMode" value={formData.colorMode} onChange={handleChange} required>
                  <option value="Noir et blanc">Noir et blanc</option>
                  <option value="Couleur">Couleur</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priorité</label>
                <select id="priority" name="priority" value={formData.priority} onChange={handleChange} required>
                  <option value="Basse">Basse</option>
                  <option value="Normale">Normale</option>
                  <option value="Haute">Haute</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="doubleSided"
                name="doubleSided"
                checked={formData.doubleSided}
                onChange={handleChange}
              />
              <label htmlFor="doubleSided">Impression recto-verso</label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => navigate("/my-requests")}>
            Annuler
          </button>
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner" /> Soumission en cours...
              </>
            ) : (
              "Soumettre la demande"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
