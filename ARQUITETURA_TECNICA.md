# 📐 ARQUITETURA TÉCNICA DO FRONT-END
## Dashboard ITR/CAR - Auditoria Fiscal e Ambiental

---

## 1. VISÃO GERAL DO SISTEMA

### Objetivo
Dashboard de tela única (Single Page Application) para auditoria inteligente que cruza dados fiscais (ITR) com dados ambientais (CAR) utilizando análise geoespacial.

### Tecnologias Core
- **React 18** - Framework principal
- **Mapbox GL** - Visualização geoespacial
- **Recharts** - Gráficos comparativos
- **CSS Modules** - Estilização componentizada
- **Lucide React** - Ícones modernos

---

## 2. ARQUITETURA DE LAYOUT (3 COLUNAS)

```
┌─────────────────────────────────────────────────────────┐
│                    VIEWPORT (100vh)                      │
├───────────┬──────────────────────────┬──────────────────┤
│  COLUNA 1 │       COLUNA 2           │    COLUNA 3      │
│  (20-25%) │       (50-55%)           │    (20-25%)      │
│           │                          │                  │
│  SIDEBAR  │      MAP VIEW            │  DETAILS PANEL   │
│           │                          │                  │
│  - Header │  - Map Container         │  - Profile       │
│  - Search │  - Layer Control         │  - Tabs (ITR/CAR)│
│  - List   │  - Date Picker           │  - Actions       │
│  (scroll) │  - Interactive Layer     │  (scroll)        │
└───────────┴──────────────────────────┴──────────────────┘
```

### Grid CSS Implementation
```css
.app {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  height: 100vh;
  overflow: hidden; /* Sem scroll na página principal */
}
```

---

## 3. ESTRUTURA DE COMPONENTES

### 3.1 Coluna 1: Sidebar (Navegação e Auditoria)

#### `<Sidebar />`
Componente raiz da coluna 1

**Props:**
```typescript
{
  municipios: Array<{id: string, nome: string}>
  selectedMunicipio: string
  onMunicipioChange: (municipio: string) => void
  properties: Array<Property>
  selectedProperty: Property
  onPropertySelect: (property: Property) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}
```

**Subcomponentes:**

#### `<Header />`
- Logo do projeto
- Dropdown de seleção de município
- Estilo: Gradiente roxo (#667eea → #764ba2)

#### `<SearchBar />`
- Input de texto com ícone de lupa
- Placeholder: "Buscar por CPF, CNPJ ou Nome..."
- Botão de limpar (X) quando há texto
- Busca em tempo real (debounce opcional)

#### `<PropertyList />`
- Container scrollável com scroll infinito
- Renderiza lista de `<PropertyCard />`
- Empty state quando não há resultados

#### `<PropertyCard />`
- Barra lateral colorida (status indicator)
- Header: Nome da propriedade + Badge de status
- Owner: Nome do proprietário + CPF/CNPJ
- Metrics: Área (ha) + Potencial arrecadação + Passivo ambiental
- Estados visuais: hover, selected
- Acessibilidade: clicável por teclado (Enter)

**Status Badges:**
```javascript
{
  divergencia_alta: {
    label: "Divergência Alta",
    color: "#EF4444",
    bgColor: "#FEE2E2",
    icon: "AlertCircle"
  },
  atencao: {
    label: "Atenção",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    icon: "AlertTriangle"
  },
  validado: {
    label: "Validado",
    color: "#10B981",
    bgColor: "#D1FAE5",
    icon: "CheckCircle"
  }
}
```

---

### 3.2 Coluna 2: MapView (Viewport Geoespacial)

#### `<MapView />`
Componente raiz da coluna 2

**Props:**
```typescript
{
  property: Property
  mapLayer: 'vector' | 'satellite'
  onLayerChange: (layer: string) => void
  selectedDate: string
  onDateChange: (date: string) => void
}
```

**Subcomponentes:**

#### `<LayerControl />` (Floating Button)
- Posição: top-left (20px, 20px)
- Botões: Vector Map | Satellite View
- Estilo: Card branco flutuante com shadow
- Ícones SVG personalizados

#### `<DatePicker />` (Floating Calendar)
- Posição: top-right (20px, 20px)
- Dropdown com datas disponíveis
- Label: "Imagem Satélite"
- Hint: "📡 Sentinel-2 (10m resolução)"

#### Map Container
**Camadas renderizadas:**
1. **Base Layer** (Vector ou Satellite)
2. **Property Polygon** - Polígono da propriedade (azul, tracejado)
3. **Divergence Overlay** - Área de divergência (hachurado vermelho)
4. **Legend** - Legenda das cores (bottom-left)

**Implementação futura com Mapbox:**
```javascript
import Map, { Source, Layer } from 'react-map-gl';

<Map
  mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
  style={{ width: '100%', height: '100%' }}
  mapStyle={mapLayer === 'vector' 
    ? 'mapbox://styles/mapbox/streets-v12'
    : 'mapbox://styles/mapbox/satellite-v9'}
  latitude={property.imovel.coordenadas_centro.lat}
  longitude={property.imovel.coordenadas_centro.lng}
  zoom={14}
>
  <Source type="geojson" data={propertyGeoJSON}>
    <Layer {...propertyLayerStyle} />
  </Source>
</Map>
```

---

### 3.3 Coluna 3: DetailsPanel (Informações e Ações)

#### `<DetailsPanel />`
Componente raiz da coluna 3

**Props:**
```typescript
{
  property: Property
}
```

**Subcomponentes:**

#### `<ProfileHeader />` (Sticky Top)
- Avatar circular com inicial do nome
- Nome completo do proprietário
- Tipo (PF/PJ) + CPF/CNPJ
- Badge de status auditoria
- Card do imóvel (nome + área)
- Estilo: Gradiente roxo igual ao Header

#### Tab Navigation
- 2 tabs: ITR (Fiscal) | CAR (Ambiental)
- Ícones diferenciados
- Active state com borda inferior roxa

#### `<ITRTab />` (Aba Fiscal)

**Cards renderizados:**

1. **Valor da Terra Nua (VTN)**
   - Comparação visual: Declarado vs Referência
   - Barra de progresso colorida
   - Alert de subdeclaração (se aplicável)
   - Percentual de divergência

2. **Grau de Utilização (GU)**
   - Percentage badge (28px, bold)
   - Barra de progresso colorida
   - Escala visual: Baixo (<30%) | Médio (30-65%) | Alto (>65%)
   - Info box com recomendações

3. **Potencial de Arrecadação**
   - Grid 2 colunas: Imposto Projetado | Incremento Potencial
   - Highlight card (borda verde)
   - Success box para alto potencial (> R$ 10k)

4. **Observações da Análise**
   - Card cinza com borda lateral roxa
   - Texto do campo `historico.observacao`

#### `<CARTab />` (Aba Ambiental)

**Cards renderizados:**

1. **Status do Cadastro**
   - Badge: Ativo (verde) | Pendente (amarelo)
   - Grid de informações: Data cadastro | Área total | APP preservada

2. **Reserva Legal**
   - Comparação: Preservada (atual) vs Exigida (lei)
   - Barra de progresso com marcador de meta
   - Deficit alert (se aplicável)
   - Cálculo em hectares

3. **Passivo Ambiental**
   - Toggle indicator: Sim (vermelho) | Não (verde)
   - Info box contextual
   - Border left colorida no card

4. **Crédito de Carbono**
   - Toggle indicator: Elegível (verde) | Não Elegível (cinza)
   - Info box com ícone de globo
   - Explicação sobre elegibilidade

5. **Recomendações**
   - Lista com bullets coloridos
   - Items urgentes (vermelho)
   - Items de atenção (amarelo)
   - Items validados (verde)

#### `<ActionFooter />` (Sticky Bottom)
- Summary badge (status rápido)
- 2 botões em grid:
  - **Secundário:** "Solicitar Documentos" (cinza)
  - **Primário:** "Validar Análise" (azul) ou "Gerar Notificação" (vermelho)
- Hint contextual (texto pequeno)
- Loading states com spinner

---

## 4. MODELO DE DADOS (JSON)

### Property Object Structure

```typescript
interface Property {
  id: string
  municipio: string
  
  proprietario: {
    nome: string
    tipo_pessoa: 'PF' | 'PJ'
    documento: string // CPF ou CNPJ
  }
  
  imovel: {
    nome: string
    area_total_ha: number
    coordenadas_centro: {
      lat: number
      lng: number
    }
    poligono: Array<[number, number]> // [lng, lat]
    area_divergente: Array<[number, number]> | null
  }
  
  status_auditoria: 'divergencia_alta' | 'atencao' | 'validado'
  
  itr_dados: {
    vtn_declarado_hectare: number
    vtn_referencia_prefeitura: number
    gu_grau_utilizacao: number // 0-100
    imposto_projetado: number
    potencial_incremento_arrecadacao: number
    ano_exercicio: number
  }
  
  car_dados: {
    status_cadastro: 'ativo' | 'pendente'
    reserva_legal_pct: number // 0-100
    reserva_legal_exigida: number // 0-100
    passivo_ambiental: boolean
    credito_carbono: boolean
    area_preservacao_permanente_ha: number
    data_cadastro: string // ISO date
  }
  
  historico: {
    data_imagem_satelite: string // ISO date
    observacao: string
  }
}
```

### Exemplo de Dados Mockados

Localização: `src/data/mockData.js`

**3 Cenários implementados:**
1. **prop_001** - Infrator fiscal (subdeclaração 72%, GU 25%)
2. **prop_002** - Propriedade modelo (validado, crédito de carbono)
3. **prop_003** - Problema ambiental (reserva legal 50% abaixo)

---

## 5. FLUXO DE ESTADO (React State)

### Estado Global do App

```javascript
const [selectedMunicipio, setSelectedMunicipio] = useState('Campinas');
const [selectedProperty, setSelectedProperty] = useState(mockProperties[0]);
const [searchQuery, setSearchQuery] = useState('');
const [mapLayer, setMapLayer] = useState('vector');
const [selectedDate, setSelectedDate] = useState('2025-01-10');
```

### Filtros e Derivações

```javascript
// Filtra propriedades por município e busca
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
  return filtered.sort((a, b) => 
    priorityOrder[a.status_auditoria] - priorityOrder[b.status_auditoria]
  );
}, [selectedMunicipio, searchQuery]);
```

### Sincronização entre Componentes

```
User Action (Sidebar) 
  → setSelectedProperty(property)
    → MapView recebe nova property via props
    → DetailsPanel recebe nova property via props
      → Re-renderiza tabs com novos dados
```

---

## 6. SISTEMA DE DESIGN

### Paleta de Cores

```css
/* Primary Colors */
--primary: #667eea;        /* Roxo principal */
--primary-dark: #764ba2;   /* Roxo escuro (gradiente) */

/* Status Colors */
--danger: #ef4444;         /* Divergência alta */
--warning: #f59e0b;        /* Atenção */
--success: #10b981;        /* Validado */
--info: #3b82f6;           /* Informativo */

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-900: #111827;
```

### Typography

```css
/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Font Sizes */
--text-xs: 11px;
--text-sm: 12px;
--text-base: 14px;
--text-lg: 16px;
--text-xl: 18px;
--text-2xl: 24px;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System

```css
/* Padding/Margin Scale */
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-full: 9999px; /* Círculos */
```

### Shadows

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
```

---

## 7. ANIMAÇÕES E TRANSIÇÕES

### Micro-interações

```css
/* Hover States */
.card:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease-out;
}

/* Active States */
.button:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}
```

### Animações de Entrada

```css
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.property-card {
  animation: fadeSlideIn 0.3s ease-out;
}
```

### Loading States

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-icon {
  animation: spin 1s linear infinite;
}
```

---

## 8. RESPONSIVIDADE

### Breakpoints

```css
/* Desktop First Approach */
@media (max-width: 1400px) {
  .app {
    grid-template-columns: 30% 45% 25%;
  }
}

@media (max-width: 1024px) {
  .app {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  /* Oculta painel de detalhes em tablets */
  .details-panel {
    display: none;
  }
}

@media (max-width: 768px) {
  /* Mobile: apenas lista ou mapa */
  .sidebar {
    width: 100%;
  }
}
```

---

## 9. OTIMIZAÇÕES DE PERFORMANCE

### Lazy Loading de Componentes

```javascript
const MapView = React.lazy(() => import('./components/MapView/MapView'));
const DetailsPanel = React.lazy(() => import('./components/DetailsPanel/DetailsPanel'));
```

### Memoization

```javascript
const filteredProperties = useMemo(() => {
  // Cálculo pesado de filtros
}, [selectedMunicipio, searchQuery]);

const PropertyCard = React.memo(({ property, isSelected, onClick }) => {
  // Evita re-render desnecessário
});
```

### Virtual Scrolling (Future)

Para listas muito grandes (>500 itens):
```bash
npm install react-window
```

---

## 10. PRÓXIMOS PASSOS (ROADMAP)

### Fase 1: MVP Funcional ✅
- [x] Estrutura de 3 colunas
- [x] Componentes da Sidebar
- [x] Placeholder do MapView
- [x] Tabs ITR e CAR
- [x] Dados mockados (5 propriedades)

### Fase 2: Integração de Mapa
- [ ] Integração com Mapbox GL
- [ ] Renderização de polígonos GeoJSON
- [ ] Overlay de divergências
- [ ] Controle de zoom e pan
- [ ] Tooltip ao passar mouse

### Fase 3: Backend Integration
- [ ] API REST endpoints
- [ ] Autenticação JWT
- [ ] Filtros avançados (data range, valores)
- [ ] Paginação server-side
- [ ] Export para PDF/Excel

### Fase 4: Features Avançadas
- [ ] Dashboard de Analytics (gráficos agregados)
- [ ] Timeline histórica (mudanças ao longo do tempo)
- [ ] Sistema de notificações
- [ ] Chat para comentários de auditoria
- [ ] Fluxo de aprovação multi-nível

---

## 11. COMANDOS DE DESENVOLVIMENTO

```bash
# Instalação
npm install

# Desenvolvimento
npm start
# Acesse: http://localhost:3000

# Build de produção
npm run build

# Testes (quando implementados)
npm test

# Análise de bundle
npm run build --report
```

---

## 12. VARIÁVEIS DE AMBIENTE

Arquivo: `.env`

```bash
# Mapbox (opcional para MVP)
REACT_APP_MAPBOX_TOKEN=pk.ey...

# API Backend (futuro)
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_API_TIMEOUT=30000

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_EXPORT=false
```

---

## 13. CHECKLIST DE QUALIDADE

### Acessibilidade (a11y)
- [ ] Todas as imagens têm `alt` text
- [ ] Navegação por teclado funciona (Tab, Enter, Esc)
- [ ] Contraste de cores passa WCAG AA
- [ ] ARIA labels em elementos interativos
- [ ] Foco visível em todos os elementos

### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse Score > 90
- [ ] Imagens otimizadas (WebP)
- [ ] Code splitting implementado

### SEO (se aplicável)
- [ ] Meta tags configuradas
- [ ] Sitemap.xml gerado
- [ ] Robots.txt configurado
- [ ] Open Graph tags

---

## 14. ESTRUTURA DE ARQUIVOS FINAL

```
ITR_CAR/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Sidebar.css
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SearchBar.css
│   │   │   ├── PropertyList.jsx
│   │   │   ├── PropertyList.css
│   │   │   ├── PropertyCard.jsx
│   │   │   └── PropertyCard.css
│   │   ├── MapView/
│   │   │   ├── MapView.jsx
│   │   │   ├── MapView.css
│   │   │   ├── LayerControl.jsx
│   │   │   ├── LayerControl.css
│   │   │   ├── DatePicker.jsx
│   │   │   └── DatePicker.css
│   │   └── DetailsPanel/
│   │       ├── DetailsPanel.jsx
│   │       ├── DetailsPanel.css
│   │       ├── ProfileHeader.jsx
│   │       ├── ProfileHeader.css
│   │       ├── ITRTab.jsx
│   │       ├── ITRTab.css
│   │       ├── CARTab.jsx
│   │       ├── CARTab.css
│   │       ├── ActionFooter.jsx
│   │       └── ActionFooter.css
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── README.md
├── .gitignore
└── .env.example
```

---

## 15. GLOSSÁRIO TÉCNICO

- **ITR** - Imposto sobre a Propriedade Territorial Rural
- **CAR** - Cadastro Ambiental Rural
- **VTN** - Valor da Terra Nua (valor do hectare sem benfeitorias)
- **GU** - Grau de Utilização (% de área produtiva)
- **APP** - Área de Preservação Permanente
- **RL** - Reserva Legal (% obrigatória de vegetação nativa)
- **Passivo Ambiental** - Dívida de área a ser recuperada
- **Crédito de Carbono** - Certificado de sequestro de CO₂

---

**Documento criado em:** 19/11/2025  
**Versão:** 1.0  
**Status:** ✅ Arquitetura Aprovada e Implementada
