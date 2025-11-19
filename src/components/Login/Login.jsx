import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Usuários mock para demonstração
  const mockUsers = [
    { username: 'admin', password: 'admin123', role: 'Administrador', name: 'Administrador Sistema' },
    { username: 'auditor', password: 'auditor123', role: 'Auditor Fiscal', name: 'Maria Oliveira' },
    { username: 'analista', password: 'analista123', role: 'Analista Ambiental', name: 'João Santos' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      const user = mockUsers.find(
        u => u.username === formData.username && u.password === formData.password
      );

      if (user) {
        onLogin({
          username: user.username,
          name: user.name,
          role: user.role,
          authenticated: true
        });
      } else {
        setError('Usuário ou senha inválidos');
        setLoading(false);
      }
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1>ITR/CAR</h1>
          <p className="login-subtitle">Auditoria Inteligente</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Digite seu usuário"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Autenticando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="demo-credentials">
            <p className="demo-title">🔑 Credenciais de Demonstração:</p>
            <div className="demo-list">
              <div className="demo-item">
                <strong>Admin:</strong> admin / admin123
              </div>
              <div className="demo-item">
                <strong>Auditor:</strong> auditor / auditor123
              </div>
              <div className="demo-item">
                <strong>Analista:</strong> analista / analista123
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-version">
        v1.0.0 | Sistema de Auditoria Fiscal e Ambiental
      </div>
    </div>
  );
};

export default Login;
