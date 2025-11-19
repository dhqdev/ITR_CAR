# Dashboard ITR/CAR - Auditoria Fiscal e Ambiental

## 📋 Descrição do Projeto

Sistema de auditoria inteligente que cruza dados do **ITR (Imposto Territorial Rural)** com o **CAR (Cadastro Ambiental Rural)** utilizando análise geoespacial para identificar divergências fiscais e ambientais.

## 🏗️ Arquitetura do Front-end

### Layout Principal (Single Page Application)
Dashboard dividido em 3 colunas sem rolagem na página principal:

#### **Coluna 1: Sidebar de Navegação e Auditoria (20-25%)**
- Header com logo e dropdown de município
- Campo de busca (CPF/CNPJ/Nome)
- Lista scrollável de propriedades
- Cards com badges de status:
  - 🔴 **Divergência Alta** (Prioridade fiscal)
  - 🟡 **Atenção** (Dados incompletos)
  - 🟢 **Validado** (Conformidade)

#### **Coluna 2: Viewport Geoespacial (50-55%)**
- Mapa interativo (Mapbox)
- Controle de camadas (Vector/Satellite)
- Date Picker para análise histórica
- Overlay de polígonos com divergências destacadas

#### **Coluna 3: Painel de Detalhes (20-25%)**
- Header com dados do proprietário
- Tabs ITR (Fiscal) e CAR (Ambiental)
- Gráficos comparativos
- Botões de ação (Validar/Notificar)

## 📊 Modelo de Dados

Cada propriedade contém:
```json
{
  "id": "identificador único",
  "municipio": "nome do município",
  "proprietario": {
    "nome": "string",
    "tipo_pessoa": "PF|PJ",
    "documento": "CPF ou CNPJ"
  },
  "imovel": {
    "nome": "string",
    "area_total_ha": "number",
    "coordenadas_centro": {"lat": number, "lng": number}
  },
  "status_auditoria": "divergencia_alta|atencao|validado",
  "itr_dados": {
    "vtn_declarado_hectare": "valor declarado",
    "vtn_referencia_prefeitura": "valor de referência",
    "gu_grau_utilizacao": "porcentagem",
    "imposto_projetado": "valor em R$",
    "potencial_incremento_arrecadacao": "valor em R$"
  },
  "car_dados": {
    "status_cadastro": "ativo|pendente",
    "reserva_legal_pct": "porcentagem atual",
    "reserva_legal_exigida": "porcentagem exigida",
    "passivo_ambiental": "boolean",
    "credito_carbono": "boolean"
  }
}
```

## 🚀 Inicialização

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm build
```

## 🗂️ Estrutura de Pastas

```
src/
├── components/
│   ├── Sidebar/
│   │   ├── Header.jsx
│   │   ├── SearchBar.jsx
│   │   ├── PropertyList.jsx
│   │   └── PropertyCard.jsx
│   ├── MapView/
│   │   ├── MapContainer.jsx
│   │   ├── LayerControl.jsx
│   │   └── DatePicker.jsx
│   └── DetailsPanel/
│       ├── ProfileHeader.jsx
│       ├── ITRTab.jsx
│       ├── CARTab.jsx
│       └── ActionFooter.jsx
├── data/
│   └── mockData.js
├── hooks/
│   └── usePropertyData.js
├── utils/
│   └── formatters.js
└── App.jsx
```

## 🎨 Stack Tecnológica

- **React 18**: Framework principal
- **Mapbox GL**: Visualização geoespacial
- **Recharts**: Gráficos comparativos
- **Lucide React**: Ícones modernos
- **CSS Modules**: Estilização componentizada

## 📈 Casos de Uso

1. **Infrator Fiscal**: VTN subdeclarado, baixo GU, alta arrecadação potencial
2. **Propriedade Regular**: Valores corretos, alta produtividade, conformidade ambiental
3. **Problema Ambiental**: Reserva legal insuficiente, passivo ambiental pendente
