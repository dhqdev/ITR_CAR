import React, { useState, useMemo } from 'react';
import { mockProperties, municipios } from './data/mockData';
import Login from './components/Login/Login';
import UserHeader from './components/Header/UserHeader';
import Sidebar from './components/Sidebar/Sidebar';
import MapView from './components/MapView/MapView';
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
  const [selectedProperty, setSelectedProperty] = useState(mockProperties[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLayer, setMapLayer] = useState('vector'); // 'vector' ou 'satellite'
  const [selectedDate, setSelectedDate] = useState('2025-01-10');

  /**
   * Filtra propriedades por município e termo de busca
   */
  const filteredProperties = useMemo(() => {
    let filtered = mockProperties.filter(
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
  }, [selectedMunicipio, searchQuery]);

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
    const firstProperty = mockProperties.find(p => p.municipio === municipio);
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
    setSelectedProperty(mockProperties[0]);
    setSearchQuery('');
  };

  // Tela de login se não estiver autenticado
  if (!user) {
    return <Login onLogin={handleLogin} />;
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
      <MapView
        property={selectedProperty}
        mapLayer={mapLayer}
        onLayerChange={setMapLayer}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
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
