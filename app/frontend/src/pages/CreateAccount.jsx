import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LeaderboardBtn from '../components/LeaderboardBtn';
import MatchesBtn from '../components/MatchesBtn';
import { requestLogin, setToken, requestData } from '../services/requests';
import { positiveLogo } from '../images';
import '../styles/pages/login.css';

const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  const createAccount = async (event) => {
    event.preventDefault();

    try {
      const { token } = await requestLogin('/login/create', { email, password, username });

      setToken(token);

      const { role } = await requestData('/login/role', { email, password });

      localStorage.setItem('token',  token);
      localStorage.setItem('role',  role);

      setRole(role);
      setIsLogged(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {
        isLogged && <Navigate to="/leaderboard" />
      }
      <Header
        page="CRIE SUA CONTA"
        FirstNavigationLink={ LeaderboardBtn }
        SecondNavegationLink={ MatchesBtn }
      />
      <section className="user-login-area">
        <img src={ positiveLogo } alt="Trybe Futebol Clube Negative Logo" />
        <form>
          <h1>Área do usuário</h1>
          <label htmlFor="username-input">
            <input
              type="text"
              value={ username }
              onChange={ ({ target: { value } }) => setUsername(value) }
              data-testid="login__username_input"
              placeholder="Nome de usuário"
            />
          </label>
          <label htmlFor="email-input">
            <input
              className="login__login_input"
              type="text"
              value={ email }
              onChange={ ({ target: { value } }) => setEmail(value) }
              data-testid="login__login_input"
              placeholder="E-mail"
            />
          </label>
          <label htmlFor="password-input">
            <input
              type="password"
              value={ password }
              onChange={ ({ target: { value } }) => setPassword(value) }
              data-testid="login__password_input"
              placeholder="Senha"
            />
          </label>
          <button
            data-testid="login__login_btn"
            type="submit"
            onClick={ (event) => createAccount(event) }
          >
            Criar conta
          </button>
        </form>
      </section>
    </>
  );
};

export default CreateAccount;
