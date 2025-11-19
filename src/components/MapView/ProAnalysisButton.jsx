import React, { useState } from 'react';
import { Sparkles, X, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import './ProAnalysisButton.css';

const ProAnalysisButton = ({ property }) => {
  const [showModal, setShowModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const runProAnalysis = () => {
    setAnalyzing(true);
    setAnalysisComplete(false);

    // Simular análise com delay
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const getAnalysisData = () => {
    if (!property) return null;

    const vtnDiff = property.itr_dados.vtn_referencia_prefeitura - property.itr_dados.vtn_declarado_hectare;
    const subdeclaracao = ((vtnDiff / property.itr_dados.vtn_referencia_prefeitura) * 100).toFixed(1);
    const reservaLegalDeficit = 20 - property.car_dados.reserva_legal_pct;

    return {
      fiscal: {
        subdeclaracao: parseFloat(subdeclaracao),
        potencialArrecadacao: property.itr_dados.potencial_incremento_arrecadacao,
        risco: subdeclaracao > 50 ? 'Alto' : subdeclaracao > 25 ? 'Médio' : 'Baixo'
      },
      ambiental: {
        deficitReserva: reservaLegalDeficit,
        passivoAmbiental: property.car_dados.passivo_ambiental,
        creditoCarbono: property.car_dados.credito_carbono,
        risco: reservaLegalDeficit > 10 ? 'Alto' : reservaLegalDeficit > 5 ? 'Médio' : 'Baixo'
      },
      prioridade: property.status_auditoria === 'divergencia_alta' ? 'Crítica' : 
                   property.status_auditoria === 'atencao' ? 'Alta' : 'Normal'
    };
  };

  const analysis = property ? getAnalysisData() : null;

  return (
    <>
      <button 
        className="pro-analysis-button"
        onClick={() => setShowModal(true)}
        disabled={!property}
        title="Análise PRO com IA"
      >
        <Sparkles size={20} />
        <span>Análise PRO</span>
      </button>

      {showModal && (
        <div className="pro-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="pro-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <div className="pro-modal-title">
                <Sparkles size={24} className="sparkles-icon" />
                <div>
                  <h2>Análise PRO</h2>
                  <p>Análise Avançada com Inteligência Artificial</p>
                </div>
              </div>
              <button 
                className="pro-modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="pro-modal-body">
              {!analysisComplete && !analyzing && (
                <div className="pro-intro">
                  <div className="pro-intro-icon">
                    <Sparkles size={48} />
                  </div>
                  <h3>Propriedade Selecionada</h3>
                  <p className="property-name">{property?.imovel.nome}</p>
                  <p className="property-owner">{property?.proprietario.nome}</p>
                  <p className="property-details">
                    {property?.imovel.area_total_ha} hectares • {property?.municipio}
                  </p>

                  <button 
                    className="start-analysis-button"
                    onClick={runProAnalysis}
                  >
                    <Sparkles size={20} />
                    Iniciar Análise PRO
                  </button>

                  <div className="analysis-features">
                    <div className="feature-item">
                      <CheckCircle size={18} />
                      <span>Análise de Subdeclaração Fiscal</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle size={18} />
                      <span>Verificação de Conformidade Ambiental</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle size={18} />
                      <span>Cálculo de Potencial de Arrecadação</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle size={18} />
                      <span>Recomendações Automatizadas</span>
                    </div>
                  </div>
                </div>
              )}

              {analyzing && (
                <div className="pro-analyzing">
                  <div className="analyzing-spinner">
                    <Sparkles size={64} className="sparkles-animate" />
                  </div>
                  <h3>Analisando propriedade...</h3>
                  <p>Processando dados fiscais e ambientais com IA</p>
                  <div className="progress-steps">
                    <div className="step active">
                      <div className="step-dot"></div>
                      <span>Carregando dados</span>
                    </div>
                    <div className="step active">
                      <div className="step-dot"></div>
                      <span>Análise fiscal</span>
                    </div>
                    <div className="step active">
                      <div className="step-dot"></div>
                      <span>Análise ambiental</span>
                    </div>
                    <div className="step">
                      <div className="step-dot"></div>
                      <span>Gerando relatório</span>
                    </div>
                  </div>
                </div>
              )}

              {analysisComplete && analysis && (
                <div className="pro-results">
                  <div className="results-header">
                    <CheckCircle size={32} className="success-icon" />
                    <h3>Análise Concluída</h3>
                    <p>Relatório completo gerado com sucesso</p>
                  </div>

                  <div className="priority-badge" data-priority={analysis.prioridade.toLowerCase()}>
                    <AlertTriangle size={18} />
                    <span>Prioridade: {analysis.prioridade}</span>
                  </div>

                  <div className="analysis-sections">
                    <div className="analysis-section">
                      <div className="section-header">
                        <TrendingUp size={20} />
                        <h4>Análise Fiscal (ITR)</h4>
                      </div>
                      <div className="section-content">
                        <div className="metric-row">
                          <span>Subdeclaração Detectada:</span>
                          <strong className={analysis.fiscal.subdeclaracao > 50 ? 'text-danger' : 'text-warning'}>
                            {analysis.fiscal.subdeclaracao}%
                          </strong>
                        </div>
                        <div className="metric-row">
                          <span>Potencial de Arrecadação:</span>
                          <strong className="text-success">
                            R$ {analysis.fiscal.potencialArrecadacao.toLocaleString('pt-BR')}
                          </strong>
                        </div>
                        <div className="metric-row">
                          <span>Nível de Risco:</span>
                          <span className={`risk-badge risk-${analysis.fiscal.risco.toLowerCase()}`}>
                            {analysis.fiscal.risco}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="analysis-section">
                      <div className="section-header">
                        <AlertTriangle size={20} />
                        <h4>Análise Ambiental (CAR)</h4>
                      </div>
                      <div className="section-content">
                        <div className="metric-row">
                          <span>Déficit Reserva Legal:</span>
                          <strong className={analysis.ambiental.deficitReserva > 0 ? 'text-danger' : 'text-success'}>
                            {analysis.ambiental.deficitReserva > 0 ? `${analysis.ambiental.deficitReserva}%` : 'Conforme'}
                          </strong>
                        </div>
                        <div className="metric-row">
                          <span>Passivo Ambiental:</span>
                          <strong className={analysis.ambiental.passivoAmbiental ? 'text-warning' : 'text-success'}>
                            {analysis.ambiental.passivoAmbiental ? 'Sim' : 'Não'}
                          </strong>
                        </div>
                        <div className="metric-row">
                          <span>Elegível Crédito Carbono:</span>
                          <strong className={analysis.ambiental.creditoCarbono ? 'text-success' : 'text-muted'}>
                            {analysis.ambiental.creditoCarbono ? 'Sim' : 'Não'}
                          </strong>
                        </div>
                        <div className="metric-row">
                          <span>Nível de Risco:</span>
                          <span className={`risk-badge risk-${analysis.ambiental.risco.toLowerCase()}`}>
                            {analysis.ambiental.risco}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="recommendations">
                    <div className="recommendations-header">
                      <Info size={20} />
                      <h4>Recomendações Automatizadas</h4>
                    </div>
                    <ul className="recommendations-list">
                      {analysis.fiscal.subdeclaracao > 50 && (
                        <li className="recommendation-item priority-high">
                          <AlertTriangle size={16} />
                          <span>Emitir notificação fiscal urgente por subdeclaração superior a 50%</span>
                        </li>
                      )}
                      {analysis.fiscal.potencialArrecadacao > 20000 && (
                        <li className="recommendation-item priority-high">
                          <TrendingUp size={16} />
                          <span>Potencial alto de arrecadação - Priorizar fiscalização</span>
                        </li>
                      )}
                      {analysis.ambiental.deficitReserva > 5 && (
                        <li className="recommendation-item priority-medium">
                          <AlertTriangle size={16} />
                          <span>Solicitar plano de recomposição de reserva legal</span>
                        </li>
                      )}
                      {analysis.ambiental.passivoAmbiental && (
                        <li className="recommendation-item priority-medium">
                          <Info size={16} />
                          <span>Requerer documentação de regularização ambiental</span>
                        </li>
                      )}
                      {analysis.ambiental.creditoCarbono && (
                        <li className="recommendation-item priority-low">
                          <CheckCircle size={16} />
                          <span>Propriedade elegível para programa de crédito de carbono</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="modal-actions">
                    <button className="action-button secondary" onClick={() => setShowModal(false)}>
                      Fechar
                    </button>
                    <button className="action-button primary">
                      <TrendingUp size={18} />
                      Exportar Relatório
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProAnalysisButton;
