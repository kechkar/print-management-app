import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginPic from '../../assets/loginPic2.jpg';
import '../../style/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        console.log('✅ Connexion réussie !');
        navigate('/Home', { state: { user: data.user } });
        console.log(data.user);
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

        <button type="submit">Log In</button>

        <button 
          type="button"
          className="switch-button"
          onClick={() => navigate('/loginAdmin')}
        >
          Connexion Admin
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
