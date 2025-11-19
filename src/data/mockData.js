/**
 * DADOS MOCKADOS - ITR/CAR Dashboard
 * 
 * Este arquivo contém 3 cenários de auditoria:
 * 1. Divergência Alta (Infrator Fiscal)
 * 2. Validado (Propriedade Modelo)
 * 3. Atenção (Problema Ambiental)
 */

export const mockProperties = [
  {
    id: "prop_001",
    municipio: "Campinas",
    proprietario: {
      nome: "Roberto Almeida Silva",
      tipo_pessoa: "PF",
      documento: "123.456.789-00"
    },
    imovel: {
      nome: "Fazenda Santa Fé",
      area_total_ha: 150.5,
      coordenadas_centro: { lat: -23.1234, lng: -47.1234 },
      // Polígono simplificado para visualização no mapa
      poligono: [
        [-47.1234, -23.1234],
        [-47.1200, -23.1234],
        [-47.1200, -23.1200],
        [-47.1234, -23.1200],
        [-47.1234, -23.1234]
      ],
      // Área de divergência (hachurado vermelho)
      area_divergente: [
        [-47.1220, -23.1220],
        [-47.1200, -23.1220],
        [-47.1200, -23.1200],
        [-47.1220, -23.1200],
        [-47.1220, -23.1220]
      ]
    },
    status_auditoria: "divergencia_alta",
    itr_dados: {
      vtn_declarado_hectare: 5000.00,
      vtn_referencia_prefeitura: 18000.00,
      gu_grau_utilizacao: 25.0,
      imposto_projetado: 12500.00,
      potencial_incremento_arrecadacao: 32000.00,
      ano_exercicio: 2024
    },
    car_dados: {
      status_cadastro: "ativo",
      reserva_legal_pct: 15.0,
      reserva_legal_exigida: 20.0,
      passivo_ambiental: true,
      credito_carbono: false,
      area_preservacao_permanente_ha: 8.5,
      data_cadastro: "2020-03-15"
    },
    historico: {
      data_imagem_satelite: "2025-01-10",
      observacao: "Área de pastagem declarada como floresta nativa. Subdeclaração de VTN em 72%. Prioridade máxima de fiscalização."
    }
  },
  {
    id: "prop_002",
    municipio: "Campinas",
    proprietario: {
      nome: "Agroindústria Verde Ltda",
      tipo_pessoa: "PJ",
      documento: "12.345.678/0001-99"
    },
    imovel: {
      nome: "Estância Rio Claro",
      area_total_ha: 320.0,
      coordenadas_centro: { lat: -23.1288, lng: -47.1290 },
      poligono: [
        [-47.1290, -23.1288],
        [-47.1250, -23.1288],
        [-47.1250, -23.1250],
        [-47.1290, -23.1250],
        [-47.1290, -23.1288]
      ],
      area_divergente: null // Sem divergências
    },
    status_auditoria: "validado",
    itr_dados: {
      vtn_declarado_hectare: 17500.00,
      vtn_referencia_prefeitura: 18000.00,
      gu_grau_utilizacao: 85.0,
      imposto_projetado: 45000.00,
      potencial_incremento_arrecadacao: 0.00,
      ano_exercicio: 2024
    },
    car_dados: {
      status_cadastro: "ativo",
      reserva_legal_pct: 22.0,
      reserva_legal_exigida: 20.0,
      passivo_ambiental: false,
      credito_carbono: true,
      area_preservacao_permanente_ha: 45.2,
      data_cadastro: "2018-06-10"
    },
    historico: {
      data_imagem_satelite: "2025-01-10",
      observacao: "Propriedade modelo. Alta produtividade e conformidade ambiental. Elegível para certificação de créditos de carbono."
    }
  },
  {
    id: "prop_003",
    municipio: "Campinas",
    proprietario: {
      nome: "Carlos Dummont",
      tipo_pessoa: "PF",
      documento: "987.654.321-11"
    },
    imovel: {
      nome: "Sítio Recanto",
      area_total_ha: 45.0,
      coordenadas_centro: { lat: -23.1100, lng: -47.1100 },
      poligono: [
        [-47.1100, -23.1100],
        [-47.1080, -23.1100],
        [-47.1080, -23.1080],
        [-47.1100, -23.1080],
        [-47.1100, -23.1100]
      ],
      area_divergente: [
        [-47.1095, -23.1095],
        [-47.1085, -23.1095],
        [-47.1085, -23.1085],
        [-47.1095, -23.1085],
        [-47.1095, -23.1095]
      ]
    },
    status_auditoria: "atencao",
    itr_dados: {
      vtn_declarado_hectare: 12000.00,
      vtn_referencia_prefeitura: 15000.00,
      gu_grau_utilizacao: 40.0,
      imposto_projetado: 1800.00,
      potencial_incremento_arrecadacao: 450.00,
      ano_exercicio: 2024
    },
    car_dados: {
      status_cadastro: "pendente",
      reserva_legal_pct: 10.0,
      reserva_legal_exigida: 20.0,
      passivo_ambiental: true,
      credito_carbono: false,
      area_preservacao_permanente_ha: 2.1,
      data_cadastro: "2022-11-20"
    },
    historico: {
      data_imagem_satelite: "2025-01-10",
      observacao: "Necessária recomposição de mata ciliar. Reserva legal 50% abaixo do exigido. Cadastro CAR pendente de validação."
    }
  },
  {
    id: "prop_004",
    municipio: "Vinhedo",
    proprietario: {
      nome: "Vinícola Terras Altas S.A.",
      tipo_pessoa: "PJ",
      documento: "23.456.789/0001-10"
    },
    imovel: {
      nome: "Vinhedo Monte Verde",
      area_total_ha: 89.3,
      coordenadas_centro: { lat: -23.0300, lng: -46.9800 },
      poligono: [
        [-46.9800, -23.0300],
        [-46.9750, -23.0300],
        [-46.9750, -23.0250],
        [-46.9800, -23.0250],
        [-46.9800, -23.0300]
      ],
      area_divergente: null
    },
    status_auditoria: "validado",
    itr_dados: {
      vtn_declarado_hectare: 25000.00,
      vtn_referencia_prefeitura: 24500.00,
      gu_grau_utilizacao: 92.0,
      imposto_projetado: 18500.00,
      potencial_incremento_arrecadacao: 0.00,
      ano_exercicio: 2024
    },
    car_dados: {
      status_cadastro: "ativo",
      reserva_legal_pct: 20.0,
      reserva_legal_exigida: 20.0,
      passivo_ambiental: false,
      credito_carbono: false,
      area_preservacao_permanente_ha: 12.8,
      data_cadastro: "2019-02-14"
    },
    historico: {
      data_imagem_satelite: "2025-01-10",
      observacao: "Propriedade em perfeita conformidade. Cultivo de vinhas com práticas sustentáveis."
    }
  },
  {
    id: "prop_005",
    municipio: "Campinas",
    proprietario: {
      nome: "Maria Santos Oliveira",
      tipo_pessoa: "PF",
      documento: "456.789.123-00"
    },
    imovel: {
      nome: "Chácara Bela Vista",
      area_total_ha: 28.7,
      coordenadas_centro: { lat: -23.1400, lng: -47.1500 },
      poligono: [
        [-47.1500, -23.1400],
        [-47.1480, -23.1400],
        [-47.1480, -23.1380],
        [-47.1500, -23.1380],
        [-47.1500, -23.1400]
      ],
      area_divergente: [
        [-47.1495, -23.1395],
        [-47.1485, -23.1395],
        [-47.1485, -23.1385],
        [-47.1495, -23.1385],
        [-47.1495, -23.1395]
      ]
    },
    status_auditoria: "divergencia_alta",
    itr_dados: {
      vtn_declarado_hectare: 8000.00,
      vtn_referencia_prefeitura: 22000.00,
      gu_grau_utilizacao: 15.0,
      imposto_projetado: 950.00,
      potencial_incremento_arrecadacao: 8500.00,
      ano_exercicio: 2024
    },
    car_dados: {
      status_cadastro: "ativo",
      reserva_legal_pct: 12.0,
      reserva_legal_exigida: 20.0,
      passivo_ambiental: true,
      credito_carbono: false,
      area_preservacao_permanente_ha: 1.5,
      data_cadastro: "2021-08-30"
    },
    historico: {
      data_imagem_satelite: "2025-01-10",
      observacao: "VTN subdeclarado em 64%. Propriedade subutilizada. Possível especulação imobiliária."
    }
  }
];

/**
 * Lista de municípios disponíveis para o dropdown
 */
export const municipios = [
  { id: "campinas", nome: "Campinas" },
  { id: "vinhedo", nome: "Vinhedo" },
  { id: "valinhos", nome: "Valinhos" },
  { id: "indaiatuba", nome: "Indaiatuba" }
];

/**
 * Configuração de badges de status
 */
export const statusConfig = {
  divergencia_alta: {
    label: "Divergência Alta",
    color: "#EF4444",
    bgColor: "#FEE2E2",
    icon: "AlertCircle",
    priority: 1
  },
  atencao: {
    label: "Atenção",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    icon: "AlertTriangle",
    priority: 2
  },
  validado: {
    label: "Validado",
    color: "#10B981",
    bgColor: "#D1FAE5",
    icon: "CheckCircle",
    priority: 3
  }
};
