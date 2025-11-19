# 📊 ESTRUTURA DE DADOS - DOCUMENTAÇÃO COMPLETA
## Dashboard ITR/CAR

---

## 1. OVERVIEW DO MODELO DE DADOS

O sistema trabalha com **5 propriedades mockadas** representando diferentes cenários de auditoria:

| ID | Proprietário | Status | Tipo de Problema | Município |
|---|---|---|---|---|
| prop_001 | Roberto Almeida Silva | 🔴 Divergência Alta | VTN subdeclarado 72% | Campinas |
| prop_002 | Agroindústria Verde Ltda | 🟢 Validado | Nenhum | Campinas |
| prop_003 | Carlos Dummont | 🟡 Atenção | Reserva legal 50% abaixo | Campinas |
| prop_004 | Vinícola Terras Altas S.A. | 🟢 Validado | Nenhum | Vinhedo |
| prop_005 | Maria Santos Oliveira | 🔴 Divergência Alta | VTN subdeclarado 64% | Campinas |

---

## 2. ESTRUTURA COMPLETA DO OBJETO `Property`

```javascript
{
  // ===== IDENTIFICAÇÃO =====
  id: "prop_001",                    // String única
  municipio: "Campinas",             // String
  
  // ===== PROPRIETÁRIO =====
  proprietario: {
    nome: "Roberto Almeida Silva",   // String
    tipo_pessoa: "PF",               // "PF" | "PJ"
    documento: "123.456.789-00"      // String (CPF ou CNPJ)
  },
  
  // ===== IMÓVEL =====
  imovel: {
    nome: "Fazenda Santa Fé",        // String
    area_total_ha: 150.5,            // Number (hectares)
    
    coordenadas_centro: {            // Objeto
      lat: -23.1234,                 // Number (latitude)
      lng: -47.1234                  // Number (longitude)
    },
    
    poligono: [                      // Array de coordenadas [lng, lat]
      [-47.1234, -23.1234],
      [-47.1200, -23.1234],
      [-47.1200, -23.1200],
      [-47.1234, -23.1200],
      [-47.1234, -23.1234]           // Fecha o polígono
    ],
    
    area_divergente: [               // Array | null (área com problema)
      [-47.1220, -23.1220],
      [-47.1200, -23.1220],
      [-47.1200, -23.1200],
      [-47.1220, -23.1200],
      [-47.1220, -23.1220]
    ]
  },
  
  // ===== STATUS DE AUDITORIA =====
  status_auditoria: "divergencia_alta",  // "divergencia_alta" | "atencao" | "validado"
  
  // ===== DADOS FISCAIS (ITR) =====
  itr_dados: {
    vtn_declarado_hectare: 5000.00,          // Number (R$/ha)
    vtn_referencia_prefeitura: 18000.00,     // Number (R$/ha)
    gu_grau_utilizacao: 25.0,                // Number (0-100%)
    imposto_projetado: 12500.00,             // Number (R$)
    potencial_incremento_arrecadacao: 32000.00, // Number (R$)
    ano_exercicio: 2024                      // Number
  },
  
  // ===== DADOS AMBIENTAIS (CAR) =====
  car_dados: {
    status_cadastro: "ativo",                // "ativo" | "pendente"
    reserva_legal_pct: 15.0,                 // Number (0-100%)
    reserva_legal_exigida: 20.0,             // Number (0-100%)
    passivo_ambiental: true,                 // Boolean
    credito_carbono: false,                  // Boolean
    area_preservacao_permanente_ha: 8.5,     // Number (hectares)
    data_cadastro: "2020-03-15"              // String (ISO date)
  },
  
  // ===== HISTÓRICO E OBSERVAÇÕES =====
  historico: {
    data_imagem_satelite: "2025-01-10",      // String (ISO date)
    observacao: "Área de pastagem declarada como floresta nativa." // String
  }
}
```

---

## 3. CENÁRIOS DE AUDITORIA IMPLEMENTADOS

### 🔴 Cenário 1: INFRATOR FISCAL (prop_001)

**Proprietário:** Roberto Almeida Silva (PF)  
**Imóvel:** Fazenda Santa Fé - 150.5 ha  
**Município:** Campinas

#### Problemas Detectados:
```
🚨 FISCAL:
- VTN Declarado: R$ 5.000/ha
- VTN Referência: R$ 18.000/ha
- Subdeclaração: 72% ❌
- GU: 25% (Muito Baixo) ❌
- Potencial Arrecadação: +R$ 32.000 💰

🌳 AMBIENTAL:
- Reserva Legal: 15% (exigido 20%) ❌
- Déficit: 5% (7.5 ha)
- Passivo Ambiental: Sim ❌
- APP: 8.5 ha

📊 PRIORIDADE: MÁXIMA
✅ Ação: Gerar Notificação Fiscal + Ambiental
```

---

### 🟢 Cenário 2: PROPRIEDADE MODELO (prop_002)

**Proprietário:** Agroindústria Verde Ltda (PJ)  
**Imóvel:** Estância Rio Claro - 320 ha  
**Município:** Campinas

#### Situação Regular:
```
✅ FISCAL:
- VTN Declarado: R$ 17.500/ha
- VTN Referência: R$ 18.000/ha
- Conformidade: 97% ✅
- GU: 85% (Alto) ✅
- Incremento: R$ 0 (já correto)

🌳 AMBIENTAL:
- Reserva Legal: 22% (exigido 20%) ✅
- Excedente: 2% (6.4 ha)
- Passivo Ambiental: Não ✅
- Crédito de Carbono: Elegível 💚
- APP: 45.2 ha

📊 PRIORIDADE: BAIXA
✅ Ação: Validar Análise (manter conformidade)
```

---

### 🟡 Cenário 3: PROBLEMA AMBIENTAL (prop_003)

**Proprietário:** Carlos Dummont (PF)  
**Imóvel:** Sítio Recanto - 45 ha  
**Município:** Campinas

#### Problemas Detectados:
```
⚠️ FISCAL:
- VTN Declarado: R$ 12.000/ha
- VTN Referência: R$ 15.000/ha
- Subdeclaração: 20% ⚠️
- GU: 40% (Médio)
- Potencial Arrecadação: +R$ 450

🌳 AMBIENTAL:
- Reserva Legal: 10% (exigido 20%) ❌
- Déficit: 10% (4.5 ha) ❌
- Passivo Ambiental: Sim ❌
- CAR: Pendente de validação ⚠️
- APP: 2.1 ha (insuficiente)

📊 PRIORIDADE: MÉDIA
✅ Ação: Solicitar Documentos + Plano de Recomposição
```

---

### 🟢 Cenário 4: CULTIVO SUSTENTÁVEL (prop_004)

**Proprietário:** Vinícola Terras Altas S.A. (PJ)  
**Imóvel:** Vinhedo Monte Verde - 89.3 ha  
**Município:** Vinhedo

#### Situação Regular:
```
✅ FISCAL:
- VTN Declarado: R$ 25.000/ha
- VTN Referência: R$ 24.500/ha
- Conformidade: 102% ✅
- GU: 92% (Muito Alto) ✅

🌳 AMBIENTAL:
- Reserva Legal: 20% (exato) ✅
- APP: 12.8 ha
- Passivo: Não ✅

📊 PRIORIDADE: BAIXA
✅ Ação: Certificar como referência regional
```

---

### 🔴 Cenário 5: ESPECULAÇÃO IMOBILIÁRIA (prop_005)

**Proprietário:** Maria Santos Oliveira (PF)  
**Imóvel:** Chácara Bela Vista - 28.7 ha  
**Município:** Campinas

#### Problemas Detectados:
```
🚨 FISCAL:
- VTN Declarado: R$ 8.000/ha
- VTN Referência: R$ 22.000/ha
- Subdeclaração: 64% ❌
- GU: 15% (Muito Baixo) ❌
- Potencial Arrecadação: +R$ 8.500 💰

🌳 AMBIENTAL:
- Reserva Legal: 12% (exigido 20%) ❌
- Déficit: 8% (2.3 ha)
- Passivo Ambiental: Sim ❌

📊 PRIORIDADE: ALTA
⚠️ Suspeita: Terra improdutiva para especulação
✅ Ação: Fiscalização in loco obrigatória
```

---

## 4. CONFIGURAÇÃO DE STATUS

Arquivo: `src/data/mockData.js`

```javascript
export const statusConfig = {
  divergencia_alta: {
    label: "Divergência Alta",
    color: "#EF4444",      // Vermelho
    bgColor: "#FEE2E2",    // Vermelho claro
    icon: "AlertCircle",
    priority: 1            // Maior prioridade
  },
  atencao: {
    label: "Atenção",
    color: "#F59E0B",      // Amarelo
    bgColor: "#FEF3C7",    // Amarelo claro
    icon: "AlertTriangle",
    priority: 2            // Prioridade média
  },
  validado: {
    label: "Validado",
    color: "#10B981",      // Verde
    bgColor: "#D1FAE5",    // Verde claro
    icon: "CheckCircle",
    priority: 3            // Menor prioridade
  }
};
```

---

## 5. LÓGICA DE CÁLCULOS

### 5.1 Percentual de Subdeclaração VTN

```javascript
const percentageDiff = ((itr.vtn_declarado_hectare / itr.vtn_referencia_prefeitura) * 100 - 100).toFixed(1);

// Exemplo prop_001:
// ((5000 / 18000) * 100) - 100 = -72.2%
// Subdeclaração de 72.2%
```

### 5.2 Déficit de Reserva Legal

```javascript
const reservaDeficit = car.reserva_legal_exigida - car.reserva_legal_pct;
const hasDeficit = reservaDeficit > 0;

// Exemplo prop_003:
// 20% - 10% = 10% de déficit
// Em hectares: 45 ha * 0.10 = 4.5 ha a recompor
```

### 5.3 Área em Hectares

```javascript
// Área de Reserva Legal em hectares
const reserva_ha = (property.imovel.area_total_ha * car.reserva_legal_pct / 100).toFixed(1);

// Área de Déficit em hectares
const deficit_ha = (property.imovel.area_total_ha * reservaDeficit / 100).toFixed(1);
```

### 5.4 Classificação de GU (Grau de Utilização)

```javascript
const classificarGU = (gu) => {
  if (gu < 30) return { label: 'Baixo', color: '#ef4444' };      // Vermelho
  if (gu < 65) return { label: 'Médio', color: '#f59e0b' };      // Amarelo
  return { label: 'Alto', color: '#10b981' };                     // Verde
};
```

---

## 6. FILTROS E ORDENAÇÃO

### 6.1 Filtro por Município

```javascript
const propertiesPorMunicipio = mockProperties.filter(
  prop => prop.municipio === 'Campinas'
);
```

### 6.2 Busca por Texto

```javascript
const buscarPropriedade = (query) => {
  const q = query.toLowerCase();
  return mockProperties.filter(prop =>
    prop.proprietario.nome.toLowerCase().includes(q) ||
    prop.proprietario.documento.includes(q) ||
    prop.imovel.nome.toLowerCase().includes(q)
  );
};
```

### 6.3 Ordenação por Prioridade

```javascript
const priorityOrder = {
  'divergencia_alta': 1,
  'atencao': 2,
  'validado': 3
};

const ordenarPorPrioridade = (properties) => {
  return properties.sort((a, b) => 
    priorityOrder[a.status_auditoria] - priorityOrder[b.status_auditoria]
  );
};
```

---

## 7. FORMATAÇÃO DE DADOS

### 7.1 Valores Monetários

```javascript
// Formatação brasileira
const formatarMoeda = (valor) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
};

// Exemplo: formatarMoeda(32000) → "R$ 32.000,00"
```

### 7.2 Datas

```javascript
// Formatação de data ISO para Brasil
const formatarData = (isoDate) => {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Exemplo: formatarData('2020-03-15') → "15 de março de 2020"
```

### 7.3 Números Decimais

```javascript
// Formatação de hectares
const formatarHectares = (ha) => {
  return ha.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
};

// Exemplo: formatarHectares(150.5) → "150,5"
```

---

## 8. ESTATÍSTICAS AGREGADAS

### 8.1 Por Município

```javascript
const estatisticasMunicipio = (municipio) => {
  const props = mockProperties.filter(p => p.municipio === municipio);
  
  return {
    total_propriedades: props.length,
    area_total: props.reduce((acc, p) => acc + p.imovel.area_total_ha, 0),
    divergencias_altas: props.filter(p => p.status_auditoria === 'divergencia_alta').length,
    potencial_arrecadacao: props.reduce((acc, p) => 
      acc + p.itr_dados.potencial_incremento_arrecadacao, 0
    ),
    propriedades_com_passivo: props.filter(p => p.car_dados.passivo_ambiental).length
  };
};

// Exemplo Campinas:
{
  total_propriedades: 4,
  area_total: 374.7 ha,
  divergencias_altas: 2,
  potencial_arrecadacao: R$ 40.950,00,
  propriedades_com_passivo: 3
}
```

---

## 9. INTEGRAÇÃO FUTURA COM BACKEND

### 9.1 Estrutura de API Endpoints

```javascript
// GET - Listar propriedades
GET /api/properties
  ?municipio=Campinas
  &status=divergencia_alta
  &page=1
  &limit=20

// GET - Detalhes de uma propriedade
GET /api/properties/:id

// POST - Gerar notificação
POST /api/properties/:id/notifications
Body: {
  tipo: "fiscal" | "ambiental",
  mensagem: "string",
  prazo_dias: 30
}

// PUT - Validar análise
PUT /api/properties/:id/validate
Body: {
  status: "validado",
  observacoes: "string",
  auditor_id: "user123"
}

// GET - Estatísticas do dashboard
GET /api/dashboard/stats
  ?municipio=Campinas
  &periodo=2024
```

### 9.2 Estrutura de Resposta da API

```javascript
{
  success: true,
  data: {
    properties: [...],
    pagination: {
      page: 1,
      limit: 20,
      total: 127,
      pages: 7
    }
  },
  meta: {
    timestamp: "2025-01-10T10:30:00Z",
    version: "1.0"
  }
}
```

---

## 10. VALIDAÇÃO DE DADOS

### 10.1 Schema de Validação (Exemplo com Yup)

```javascript
import * as yup from 'yup';

const propertySchema = yup.object().shape({
  id: yup.string().required(),
  municipio: yup.string().required(),
  
  proprietario: yup.object().shape({
    nome: yup.string().min(3).required(),
    tipo_pessoa: yup.string().oneOf(['PF', 'PJ']).required(),
    documento: yup.string().matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/).required()
  }),
  
  imovel: yup.object().shape({
    nome: yup.string().required(),
    area_total_ha: yup.number().positive().required(),
    coordenadas_centro: yup.object().shape({
      lat: yup.number().min(-90).max(90).required(),
      lng: yup.number().min(-180).max(180).required()
    })
  }),
  
  itr_dados: yup.object().shape({
    vtn_declarado_hectare: yup.number().positive().required(),
    gu_grau_utilizacao: yup.number().min(0).max(100).required()
  }),
  
  car_dados: yup.object().shape({
    reserva_legal_pct: yup.number().min(0).max(100).required(),
    passivo_ambiental: yup.boolean().required()
  })
});
```

---

## 11. EXPORTAÇÃO DE DADOS

### 11.1 CSV Export

```javascript
const exportarCSV = (properties) => {
  const headers = [
    'ID', 'Município', 'Proprietário', 'CPF/CNPJ', 
    'Imóvel', 'Área (ha)', 'Status', 
    'VTN Declarado', 'VTN Referência', 'GU (%)',
    'Potencial Arrecadação', 'Reserva Legal (%)', 'Passivo Ambiental'
  ];
  
  const rows = properties.map(p => [
    p.id,
    p.municipio,
    p.proprietario.nome,
    p.proprietario.documento,
    p.imovel.nome,
    p.imovel.area_total_ha,
    p.status_auditoria,
    p.itr_dados.vtn_declarado_hectare,
    p.itr_dados.vtn_referencia_prefeitura,
    p.itr_dados.gu_grau_utilizacao,
    p.itr_dados.potencial_incremento_arrecadacao,
    p.car_dados.reserva_legal_pct,
    p.car_dados.passivo_ambiental ? 'Sim' : 'Não'
  ]);
  
  return [headers, ...rows];
};
```

---

**Documento criado em:** 19/11/2025  
**Versão:** 1.0  
**Status:** ✅ Completo e Documentado
