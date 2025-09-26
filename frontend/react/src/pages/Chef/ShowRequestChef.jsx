"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  FaArrowLeft,
  FaDownload,
  FaCheck,
  FaTimes,
  FaEye,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
} from "react-icons/fa"
import "./ShowRequestChef.css"

const RequestDetails = () => {
  const { id} = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comment, setComment] = useState("")
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    const fetchRequestDetails = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("userToken")
        const response = await fetch(`http://localhost:5000/api/print-requests/request/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Impossible de récupérer les détails de la requête")
        }

        const data = await response.json()
        setRequest(data)
      } catch (err) {
        console.error("Erreur:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRequestDetails()
  }, [id])

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("userToken")
      const response = await fetch(`http://localhost:5000/api/print-requests/approve/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      })

      if (!response.ok) {
        throw new Error("Impossible d'approuver la requête")
      }

      // Mettre à jour l'état local
      setRequest((prev) => ({ ...prev, status: "approved", comment }))
      alert("Requête approuvée avec succès")
    } catch (err) {
      console.error("Erreur:", err)
      alert(`Erreur: ${err.message}`)
    }
  }

  const handleReject = async () => {
    if (!comment) {
      alert("Veuillez fournir un commentaire expliquant la raison du rejet")
      return
    }

    try {
      const token = localStorage.getItem("userToken")
      const response = await fetch(`http://localhost:5000/api/print-requests/reject/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      })

      if (!response.ok) {
        throw new Error("Impossible de rejeter la requête")
      }

      // Mettre à jour l'état local
      setRequest((prev) => ({ ...prev, status: "rejected", comment }))
      alert("Requête rejetée avec succès")
    } catch (err) {
      console.error("Erreur:", err)
      alert(`Erreur: ${err.message}`)
    }
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase()

    if (["pdf"].includes(extension)) return <FaFilePdf className="file-icon pdf" />
    if (["doc", "docx"].includes(extension)) return <FaFileWord className="file-icon word" />
    if (["xls", "xlsx"].includes(extension)) return <FaFileExcel className="file-icon excel" />
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return <FaFileImage className="file-icon image" />

    return <FaFilePdf className="file-icon" />
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "en attente":
        return <span className="status-badge pending">En attente</span>
      case "validé":
        return <span className="status-badge approved">Validé</span>
      case "rejeté":
        return <span className="status-badge rejected">Rejeté</span>
      case "imprimé":
        return <span className="status-badge completed">Imprimé</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="request-details-container">
        <div className="loading-spinner">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="request-details-container">
        <div className="error-message">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Retour
          </button>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="request-details-container">
        <div className="error-message">
          <h2>Requête non trouvée</h2>
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Retour
          </button>
        </div>
      </div>
    )
  }
 
  return (
    <div className="request-details-container">
      <div className="request-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Retour
        </button>
        <h1>{request.title || id}</h1>
        {getStatusBadge(request.status)}
      </div>

      <div className="request-details-tabs">
        <button
          className={`tab-button ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Informations
        </button>
        <button className={`tab-button ${activeTab === "files" ? "active" : ""}`} onClick={() => setActiveTab("files")}>
          Fichiers
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Historique
        </button>
      </div>

      <div className="request-details-content">
        {activeTab === "details" && (
          <div className="details-tab">
            <div className="details-grid">
              <div className="detail-item">
                <h3>Demandeur</h3>
                <p>{request.teacherLastName || "Non spécifié"}</p>
              </div>
              <div className="detail-item">
                <h3>Département</h3>
                <p>{request.departmentName || "Non spécifié"}</p>
              </div>
              <div className="detail-item">
                <h3>Date de soumission</h3>
                <p>
                  {new Date(request.submissionDateTime).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="detail-item">
                <h3>Priorité</h3>
                <p className={`priority ${request.priority || "normal"}`}>
                  {request.priority || "Normale"}
                </p>
              </div>
              <div className="detail-item">
                <h3>Nombre de copies</h3>
                <p>{request.nombreExemplaires || 1}</p>
              </div>
              <div className="detail-item">
                <h3>Format</h3>
                <p>{request.paperSize || "A4"}</p>
              </div>
              <div className="detail-item">
                <h3>Recto/Verso</h3>
                <p>{request.doubleSided ? "Oui" : "Non"}</p>
              </div>
              <div className="detail-item">
                <h3>Couleur</h3>
                <p>{request.colorMode}</p>
              </div>
            </div>

            <div className="detail-item full-width">
              <h3>Description</h3>
              <p className="description">{request.description || "Aucune description fournie."}</p>
            </div>

            {request.comment && (
              <div className="detail-item full-width">
                <h3>Commentaire</h3>
                <p className="comment">{request.comment}</p>
              </div>
            )}

            {request.status === "en attente" && (
              <div className="action-section">
                <h3>Actions</h3>
                <div className="comment-input">
                  <label htmlFor="comment">Commentaire (obligatoire pour le rejet)</label>
                  <textarea
                    id="comment"
                    className="input-textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                  />
                </div>
                <div className="action-buttons">
                  <button className="approve-button" onClick={handleApprove}>
                    <FaCheck /> Approuver
                  </button>
                  <button className="reject-button" onClick={handleReject}>
                    <FaCheck /> Rejeter
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "files" && (
          <div className="files-tab">
            <h3>Fichiers attachés</h3>
            {request.files && request.files.length > 0 ? (
              <div className="files-list">
                {request.files.map((file, index) => (
                  <div key={index} className="file-item">
                    {getFileIcon(file.name)}
                    <div className="file-info">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <div className="file-actions">
                      <button className="file-action-button" title="Prévisualiser">
                        <FaEye />
                      </button>
                      <button className="file-action-button" title="Télécharger">
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-files">Aucun fichier attaché à cette requête.</p>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="history-tab">
            <h3>Historique des actions</h3>
            {request.history && request.history.length > 0 ? (
              <div className="history-timeline">
                {request.history.map((event, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <p className="timeline-date">
                        {new Date(event.date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="timeline-action">{event.action}</p>
                      <p className="timeline-user">{event.user}</p>
                      {event.comment && <p className="timeline-comment">{event.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-history">Aucun historique disponible pour cette requête.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RequestDetails
