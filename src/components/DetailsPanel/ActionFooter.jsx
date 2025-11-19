import React, { useState } from 'react';
import './ActionFooter.css';

/**
 * ActionFooter Component - Botões de ação no rodapé
 */
function ActionFooter({ property }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSolicitarDocumentos = () => {
    setIsLoading(true);
    // Simula chamada de API
    setTimeout(() => {
      alert(`✉️ Solicitação de documentos enviada para:\n${property.proprietario.nome}\n${property.proprietario.documento}`);
      setIsLoading(false);
    }, 1500);
  };

  const handleValidarAnalise = () => {
    setIsLoading(true);
    // Simula chamada de API
    setTimeout(() => {
      if (property.status_auditoria === 'validado') {
        alert(`✅ Análise validada com sucesso!\nPropriedade: ${property.imovel.nome}\nStatus: Conformidade mantida`);
      } else {
        alert(`📋 Notificação gerada!\nPropriedade: ${property.imovel.nome}\nMotivo: ${property.historico.observacao}`);
      }
      setIsLoading(false);
    }, 1500);
  };

  const isPrioridade = property.status_auditoria === 'divergencia_alta';

  return (
    <div className="action-footer">
      {/* Resumo rápido */}
      <div className="action-summary">
        {isPrioridade ? (
          <div className="summary-alert">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <span>Prioridade de Fiscalização</span>
          </div>
        ) : property.status_auditoria === 'validado' ? (
          <div className="summary-success">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Propriedade Regular</span>
          </div>
        ) : (
          <div className="summary-warning">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>Requer Atenção</span>
          </div>
        )}
      </div>

      {/* Botões de ação */}
      <div className="action-buttons">
        <button
          className="btn btn-secondary"
          onClick={handleSolicitarDocumentos}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isLoading ? 'Enviando...' : 'Solicitar Documentos'}
        </button>

        <button
          className={`btn ${isPrioridade ? 'btn-danger' : 'btn-primary'}`}
          onClick={handleValidarAnalise}
          disabled={isLoading}
        >
          {isPrioridade ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {isLoading ? 'Gerando...' : 'Gerar Notificação'}
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {isLoading ? 'Validando...' : 'Validar Análise'}
            </>
          )}
        </button>
      </div>

      {/* Informação adicional */}
      <div className="action-hint">
        💡 {isPrioridade 
          ? 'Divergência detectada. Notificação formal recomendada.' 
          : property.status_auditoria === 'validado' 
          ? 'Validação registrará conformidade no sistema.' 
          : 'Solicite documentos antes de gerar notificação.'}
      </div>
    </div>
  );
}

export default ActionFooter;
