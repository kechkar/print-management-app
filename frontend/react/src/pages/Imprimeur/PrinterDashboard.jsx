"use client"
import { AiFillHome } from "react-icons/ai";
import { useState, useEffect } from "react"
import "../Enseignant/TeacherDashboard.css"
import {
  FaArrowLeft,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaSpinner,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    rejected: 0,
  })

  const navigate = useNavigate()

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, statusFilter])

  const fetchRequests = async () => {
    const token = localStorage.getItem("userToken")
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/tracking/all-validated-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const responseData = await res.json()
      console.log(responseData)
      if (!res.ok) {
        throw new Error(responseData.message || "Erreur lors de la récupération des demandes")
      }

      // Vérifier si responseData est un tableau ou s'il contient un tableau
      let requestsArray = []

      if (Array.isArray(responseData)) {
        // Si responseData est déjà un tableau
        requestsArray = responseData
      } else if (responseData.requests && Array.isArray(responseData.requests)) {
        // Si responseData est un objet avec une propriété 'requests' qui est un tableau
        requestsArray = responseData.requests
      } else if (responseData.data && Array.isArray(responseData.data)) {
        // Si responseData est un objet avec une propriété 'data' qui est un tableau
        requestsArray = responseData.data
      } else {
        // Si aucun tableau n'est trouvé, utiliser un tableau vide
        console.error("Format de réponse inattendu:", responseData)
        requestsArray = []
      }

      setRequests(requestsArray)
      calculateStats(requestsArray)
      setError("")
    } catch (error) {
      console.error("❌ Erreur :", error)
      setError(`Erreur : ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (data) => {
    if (!Array.isArray(data)) {
      console.error("calculateStats: data n'est pas un tableau", data)
      setStats({
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        rejected: 0,
      })
      return
    }

    const stats = {
      total: data.length,
      pending: data.filter((req) => req.status === "en attente").length,
      processing: data.filter((req) => req.status === "validé").length,
      completed: data.filter((req) => req.status === "imprimé").length,
      rejected: data.filter((req) => req.status === "rejeté").length,
    }
    setStats(stats)
  }

  const filterRequests = () => {
    let filtered = [...requests]
    console.log(filtered)
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.documentName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    // Filtrer par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }
    setFilteredRequests(filtered)
    console.log(filtered)
  }
  

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) {
        console.error("❌ Invalid date input:", dateString);
        return "Invalid Date"; // Provide a fallback value
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        console.error("❌ Unable to parse date:", dateString);
        return "Invalid Date";
    }
    
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",

        minute: "2-digit",
    }).format(date);
};

  // Obtenir la classe CSS pour le statut
  const getStatusClass = (status) => {
    switch (status) {
      case "en attente":
        return "status-pending"
      case "validé par departement":
        return "status-processing"
      case "imprimé":
        return "status-completed"
      case "rejeté":
        return "status-rejected"
      default:
        return ""
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Tableau de Bord</h2>
        <div className="header-actions">
          <div className="back-button" onClick={() => navigate("/Home")}>
        <FaArrowLeft /> <span>Retour</span>
      </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FaFileAlt />
          </div>
          <div className="stat-content">
            <h3>Total</h3>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>En attente</h3>
            <p>{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon processing">
            <FaSpinner />
          </div>
          <div className="stat-content">
            <h3>Validées</h3>
            <p>{stats.processing}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Imprimées</h3>
            <p>{stats.completed}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rejected">
            <FaTimesCircle />
          </div>
          <div className="stat-content">
            <h3>Rejetées</h3>
            <p>{stats.rejected}</p>
          </div>
        </div>
      </div>

      <div className="filters-container">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par titre ou nom de document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="status-filter">
          <FaFilter className="filter-icon" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">Tous les statuts</option>
            <option value="en attente">En attente</option>
            <option value="validé">Validé</option>
            <option value="imprimé">Imprimé</option>
            <option value="rejeté">Rejeté</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Chargement des demandes...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="no-requests">
          <p>Aucune demande d'impression trouvée.</p>
          {searchTerm || statusFilter !== "all" ? (
            <p>Essayez de modifier vos filtres de recherche.</p>
          ) : (
            <p>Cliquez sur "Nouvelle Demande" pour créer votre première demande d'impression.</p>
          )}
        </div>
      ) : (
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Document</th>
                <th>Date de soumission</th>
                <th>Statut</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request._id.substring(0, 8)}...</td>
                  <td>{request.title}</td>
                  <td>{request.documentType}</td>
                  <td>{formatDate(request.submissionDateTime)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(request.status)}`}>{request.status}</span>
                  </td>
                  <td>
                    <button
                      className="view-button"
                      onClick={
                        () => {navigate(`/PrintRequestPrinter/${request._id}`)}}
                      title="Voir les détails"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
