import React, { useState, useMemo, useEffect } from 'react';
import Login from './components/Login/Login';
import UserHeader from './components/Header/UserHeader';
import Sidebar from './components/Sidebar/Sidebar';
import RealMapView from './components/MapView/RealMapView';
import DetailsPanel from './components/DetailsPanel/DetailsPanel';
import './App.css';

/**
 * APLICAÇÃO PRINCIPAL - ITR/CAR Dashboard
 * 
 * Arquitetura: Single Page Application com 3 colunas
 * - Coluna 1: Sidebar (20-25%)
 * - Coluna 2: Mapa (50-55%)
 * - Coluna 3: Detalhes (20-25%)
 * 
 * Features:
 * - Sistema de autenticação
 * - Análise PRO com IA
 * - Gestão de usuários e perfis
 */
function App() {
  // Estado de autenticação
  const [user, setUser] = useState(null);

  // Estado global da aplicação
  const [selectedMunicipio, setSelectedMunicipio] = useState('Campinas');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Estado para dados da API
  const [properties, setProperties] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Carrega propriedades e municípios do banco de dados
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Busca todas as propriedades
        const propertiesResponse = await fetch('http://localhost:5000/api/properties');
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData);

        // Busca municípios
        const municipiosResponse = await fetch('http://localhost:5000/api/municipios');
        const municipiosData = await municipiosResponse.json();
        setMunicipios(municipiosData);

        // Seleciona a primeira propriedade como padrão
        if (propertiesData.length > 0) {
          setSelectedProperty(propertiesData[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  /**
   * Filtra propriedades por município e termo de busca
   */
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(
      prop => prop.municipio === selectedMunicipio
    );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prop =>
        prop.proprietario.nome.toLowerCase().includes(query) ||
        prop.proprietario.documento.includes(query) ||
        prop.imovel.nome.toLowerCase().includes(query)
      );
    }

    // Ordena por prioridade de auditoria
    const priorityOrder = {
      'divergencia_alta': 1,
      'atencao': 2,
      'validado': 3
    };

    return filtered.sort((a, b) => 
      priorityOrder[a.status_auditoria] - priorityOrder[b.status_auditoria]
    );
  }, [properties, selectedMunicipio, searchQuery]);

  /**
   * Handler para seleção de propriedade
   */
  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  /**
   * Handler para mudança de município
   */
  const handleMunicipioChange = (municipio) => {
    setSelectedMunicipio(municipio);
    // Seleciona a primeira propriedade do novo município
    const firstProperty = properties.find(p => p.municipio === municipio);
    if (firstProperty) {
      setSelectedProperty(firstProperty);
    }
  };

  /**
   * Handler para login
   */
  const handleLogin = (userData) => {
    setUser(userData);
  };

  /**
   * Handler para logout
   */
  const handleLogout = () => {
    setUser(null);
    setProperties([]);
    setMunicipios([]);
    setSelectedProperty(null);
    setSearchQuery('');
  };

  // Tela de login se não estiver autenticado
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Tela de carregamento
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Carregando dados...
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Header com informações do usuário */}
      <UserHeader user={user} onLogout={handleLogout} />
      
      <div className="app">
      {/* COLUNA 1: Sidebar de Navegação e Auditoria */}
      <Sidebar
        municipios={municipios}
        selectedMunicipio={selectedMunicipio}
        onMunicipioChange={handleMunicipioChange}
        properties={filteredProperties}
        selectedProperty={selectedProperty}
        onPropertySelect={handlePropertySelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* COLUNA 2: Viewport Geoespacial */}
      <RealMapView
        property={selectedProperty}
      />

      {/* COLUNA 3: Painel de Detalhes e Ação */}
      <DetailsPanel
        property={selectedProperty}
      />
      </div>
    </div>
  );
}

export default App;
