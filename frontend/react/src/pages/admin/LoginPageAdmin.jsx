import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Importer le hook
import loginPic from '../../assets/loginPic2.jpg';
import '../../style/LoginPage.css';

function LoginPageAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);

  const navigate = useNavigate(); // ✅ Initialisation

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const res = await fetch('http://localhost:5000/api/auth/login-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, secretKey })
      });
  
      const data = await res.json();
      console.log(data);
  
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('userToken', data.token);
        console.log(data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        console.log('✅ Connexion réussie !');
        
        // Redirection unique avec passage de l'état
        navigate('/Home', { state: { user: data.user } });
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Erreur de connexion 😢', err);
      setError('Erreur de connexion au serveur');
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-image">
        <img src={loginPic} alt="Login illustration" />
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Log In</h1>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Entrer votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Mot de passe</label>
        <input
          type="password"
          placeholder="Entrer votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Clé secrète</label>
        <input
          type="text"
          placeholder="Entrer votre clé secrète"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
        <button 
            type="button"
            className="switch-button"
            onClick={() => navigate('/login')}
          >
            Connexion Standard
          </button>
      </form>
    </div>
  );
}

export default LoginPageAdmin;
