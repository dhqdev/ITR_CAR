# 🚀 GUIA DE INSTALAÇÃO E EXECUÇÃO
## Dashboard ITR/CAR

---

## ✅ PRÉ-REQUISITOS

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 16.x ou superior
- **npm** versão 8.x ou superior (vem com Node.js)
- **Git** (opcional, para controle de versão)
- **VS Code** ou editor de código de sua preferência

### Verificar Instalações

```bash
node --version
# Deve mostrar: v16.x.x ou superior

npm --version
# Deve mostrar: 8.x.x ou superior
```

---

## 📦 INSTALAÇÃO

### Passo 1: Navegar até a pasta do projeto

```bash
cd "/home/david/Área de trabalho/ITR_CAR"
```

### Passo 2: Instalar dependências

```bash
npm install
```

Isso irá instalar:
- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1
- React Map GL 7.1.6 (para Mapbox)
- Mapbox GL 3.0.1
- Recharts 2.10.3 (para gráficos)
- Lucide React 0.294.0 (para ícones)

**Tempo estimado:** 2-5 minutos (dependendo da conexão)

---

## ▶️ EXECUTAR EM MODO DESENVOLVIMENTO

```bash
npm start
```

Isso irá:
1. Compilar o projeto
2. Iniciar o servidor de desenvolvimento
3. Abrir automaticamente no navegador: `http://localhost:3000`

**Tempo de inicialização:** ~30 segundos

### Hot Reload Ativo ✨
Qualquer mudança no código será refletida automaticamente no navegador sem precisar recarregar!

---

## 🔍 EXPLORANDO A APLICAÇÃO

### Interface Inicial

Ao abrir `http://localhost:3000`, você verá:

```
┌────────────────────────────────────────────────────────────┐
│                   ITR/CAR DASHBOARD                         │
├──────────┬─────────────────────────┬────────────────────────┤
│ SIDEBAR  │      MAPA CENTRAL       │   PAINEL DETALHES      │
│          │                         │                        │
│ 5 props  │  Fazenda Santa Fé       │  Roberto Almeida Silva │
│ listadas │  (selecionada)          │  🔴 Divergência Alta   │
│          │                         │                        │
│          │  [Polígono no mapa]     │  Tabs: ITR | CAR       │
└──────────┴─────────────────────────┴────────────────────────┘
```

### Funcionalidades Testáveis

1. **Dropdown de Município** (canto superior esquerdo)
   - Campinas (4 propriedades)
   - Vinhedo (1 propriedade)

2. **Campo de Busca**
   - Digite: "Roberto" → Filtra Fazenda Santa Fé
   - Digite: "123.456" → Filtra por CPF
   - Digite: "Verde" → Filtra Agroindústria Verde

3. **Lista de Propriedades** (scroll vertical)
   - Clique em qualquer card para visualizar detalhes
   - Cards ordenados por prioridade (vermelho → amarelo → verde)

4. **Mapa Central**
   - Botão "Vector" / "Satellite" (canto superior esquerdo)
   - Date Picker (canto superior direito)
   - Legenda (canto inferior esquerdo)

5. **Painel de Detalhes**
   - Tabs: ITR (Fiscal) / CAR (Ambiental)
   - Botões: "Solicitar Documentos" / "Gerar Notificação" ou "Validar"

---

## 🎯 CASOS DE TESTE

### Teste 1: Infrator Fiscal
```
1. Selecione: "Fazenda Santa Fé" (Roberto Almeida Silva)
2. Observe: Badge 🔴 "Divergência Alta"
3. Aba ITR:
   - VTN: R$ 5.000 vs R$ 18.000
   - Barra vermelha (subdeclaração 72%)
   - GU: 25% (Baixo)
   - Potencial: +R$ 32.000
4. Aba CAR:
   - Reserva Legal: 15% / 20% (déficit 5%)
   - Passivo Ambiental: Sim
5. Clique: "Gerar Notificação" → Alert de confirmação
```

### Teste 2: Propriedade Validada
```
1. Selecione: "Estância Rio Claro" (Agroindústria Verde)
2. Observe: Badge 🟢 "Validado"
3. Aba ITR:
   - VTN: R$ 17.500 vs R$ 18.000 (conformidade)
   - GU: 85% (Alto)
   - Potencial: R$ 0 (já correto)
4. Aba CAR:
   - Reserva Legal: 22% / 20% (excedente!)
   - Passivo: Não
   - Crédito de Carbono: Elegível ✅
5. Clique: "Validar Análise" → Alert de sucesso
```

### Teste 3: Problema Ambiental
```
1. Selecione: "Sítio Recanto" (Carlos Dummont)
2. Observe: Badge 🟡 "Atenção"
3. Aba CAR:
   - Reserva Legal: 10% / 20% (déficit 10%)
   - Barra vermelha indicando déficit
   - CAR: Pendente de validação
   - Recomendação: "Recompor 4.5 hectares"
4. Clique: "Solicitar Documentos"
```

---

## 🏗️ BUILD DE PRODUÇÃO

### Gerar Build Otimizado

```bash
npm run build
```

Isso irá:
1. Criar pasta `build/` com arquivos otimizados
2. Minificar JavaScript e CSS
3. Otimizar imagens
4. Gerar source maps

**Tamanho final:** ~2-3 MB (com Mapbox incluído)

### Testar Build Localmente

```bash
# Instalar servidor estático
npm install -g serve

# Servir build
serve -s build

# Acesse: http://localhost:3000
```

---

## 🐛 TROUBLESHOOTING

### Problema: "Port 3000 already in use"

**Solução 1:** Matar processo na porta 3000
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

**Solução 2:** Usar outra porta
```bash
PORT=3001 npm start
```

---

### Problema: "Module not found" ou erros de dependência

**Solução:**
```bash
# Limpar cache do npm
npm cache clean --force

# Deletar node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

---

### Problema: Página em branco no navegador

**Verificar:**
1. Console do navegador (F12) para erros JavaScript
2. Terminal para erros de compilação
3. Arquivo `public/index.html` existe
4. Arquivo `src/index.js` existe

**Solução:**
```bash
# Limpar build
rm -rf build

# Reiniciar servidor
npm start
```

---

### Problema: Estilos não aplicados

**Verificar:**
1. Imports de CSS nos componentes:
   ```javascript
   import './Component.css';
   ```
2. Classes CSS corretas no JSX:
   ```javascript
   <div className="card"> {/* className, não class */}
   ```

---

## 📊 ESTRUTURA DE PASTAS GERADA

Após instalação, a estrutura será:

```
ITR_CAR/
├── node_modules/           # Dependências (não versionar)
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar/        # 8 arquivos
│   │   ├── MapView/        # 6 arquivos
│   │   └── DetailsPanel/   # 10 arquivos
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── package-lock.json       # Gerado após npm install
├── README.md
├── ARQUITETURA_TECNICA.md
├── ESTRUTURA_DADOS.md
├── GUIA_INSTALACAO.md      # Este arquivo
├── .gitignore
└── .env.example

Total de arquivos: ~35
```

---

## 🔐 VARIÁVEIS DE AMBIENTE (OPCIONAL)

Para usar Mapbox real (futuramente):

1. Criar arquivo `.env` na raiz:
```bash
cp .env.example .env
```

2. Editar `.env`:
```bash
REACT_APP_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXIiLCJhIjoieW91cnRva2VuIn0...
```

3. Reiniciar servidor:
```bash
npm start
```

---

## 📈 PRÓXIMOS PASSOS

### Para Desenvolvedores

1. **Adicionar Testes Unitários**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm test
```

2. **Linter e Formatação**
```bash
npm install --save-dev eslint prettier
npx eslint src/
```

3. **Análise de Bundle**
```bash
npm install --save-dev webpack-bundle-analyzer
npm run build
```

### Para Integração Backend

1. Configurar proxy em `package.json`:
```json
{
  "proxy": "http://localhost:3001"
}
```

2. Substituir `mockData.js` por chamadas de API:
```javascript
// Antes
import { mockProperties } from './data/mockData';

// Depois
const fetchProperties = async () => {
  const response = await fetch('/api/properties');
  const data = await response.json();
  return data.properties;
};
```

---

## 🎨 PERSONALIZAÇÕES RÁPIDAS

### Trocar Cores do Tema

Editar `src/App.css`:
```css
/* De roxo para azul */
--primary: #3b82f6;        /* Era: #667eea */
--primary-dark: #2563eb;   /* Era: #764ba2 */
```

### Adicionar Logo Personalizado

1. Colocar imagem em `public/logo.png`
2. Editar `src/components/Sidebar/Header.jsx`:
```javascript
<img src="/logo.png" alt="Logo" width="40" />
```

### Trocar Ícones

Substituir SVG inline por componentes Lucide:
```bash
npm install lucide-react
```

```javascript
import { AlertCircle, MapPin, Home } from 'lucide-react';

<AlertCircle size={20} color="#ef4444" />
```

---

## 📞 SUPORTE

### Logs de Desenvolvimento

**Ver logs detalhados:**
```bash
npm start --verbose
```

**Ver apenas erros:**
```bash
npm start 2>&1 | grep ERROR
```

### Recursos Úteis

- [Documentação React](https://react.dev/)
- [Create React App Docs](https://create-react-app.dev/)
- [Mapbox GL JS API](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Recharts Examples](https://recharts.org/en-US/examples)

---

## ✅ CHECKLIST DE INSTALAÇÃO

- [ ] Node.js 16+ instalado
- [ ] npm install executado sem erros
- [ ] npm start funcionando
- [ ] Página abre em http://localhost:3000
- [ ] 5 propriedades visíveis na lista
- [ ] Dropdown de município funciona
- [ ] Busca funciona
- [ ] Clique em card altera mapa e detalhes
- [ ] Tabs ITR/CAR funcionam
- [ ] Botões de ação mostram alert

---

**Tempo total de setup:** ~5-10 minutos  
**Status:** ✅ Pronto para Desenvolvimento  
**Versão:** 1.0
