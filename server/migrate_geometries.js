const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Carrega o banco de dados
const db = new Database(path.join(__dirname, 'itr_car.db'));

// Carrega o JSON com os dados de geometrias
const jsonPath = path.join(__dirname, '..', 'terrein search', 'imovel_dados_clean.json');
const geometryData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log('🔄 Migrando geometrias para o banco de dados...\n');

// Adiciona coluna geometry_wkt se não existir
try {
  db.exec(`
    ALTER TABLE properties ADD COLUMN geometry_wkt TEXT;
  `);
  console.log('✓ Coluna geometry_wkt adicionada');
} catch (e) {
  if (e.message.includes('duplicate column name')) {
    console.log('ℹ️  Coluna geometry_wkt já existe');
  } else {
    throw e;
  }
}

// Mapeia os IDs das propriedades para os lotes do JSON
const propertyMapping = {
  'prop_001': 'BA-2902005-AD06AC9BEE924477AA13EFE0908D15E0',  // Fazenda Santa Fé - BA (7 items)
  'prop_002': 'SC-4210100-EA1F3824FC3D4148B83F921E253C6DCD',  // Estância Rio Claro - SC (25 items)
  'prop_003': 'RJ-3301009-DC994438D87A4CE29E7EECC060BB792E',  // Sítio Recanto - RJ (10 items)
  'prop_004': 'PI-2200806-97CAEADC4E0A46F5BDB3374851967EDB',  // Vinhedo Monte Verde - PI (6 items)
  'prop_005': 'PR-4127965-5B8ED84AA1A94E6399506A04DE910B83'   // Chácara Bela Vista - PR (5 items)
};

// Função para extrair geometria WKT do JSON
function extractGeometry(loteId) {
  const loteData = geometryData[loteId];
  if (!loteData) {
    console.log(`  ⚠ Lote ${loteId} não encontrado no JSON`);
    return null;
  }
  
  if (!loteData.result) {
    console.log(`  ⚠ Lote ${loteId} não tem 'result'`);
    return null;
  }

  // Prioridade de temas para pegar a geometria
  const temaPrioridade = [
    'Área do Imovel',
    'Área Líquida do Imóvel', 
    'APP Total',
    'Área Consolidada'
  ];

  for (const tema of temaPrioridade) {
    for (const item of loteData.result) {
      if (item.tema === tema && item.geoareatema) {
        console.log(`  ✓ Geometria encontrada no tema: ${tema}`);
        return item.geoareatema;
      }
    }
  }

  // Se não encontrou, pega o primeiro que tiver geometria (geoareatema ou areatotal)
  for (const item of loteData.result) {
    if (item.geoareatema) {
      console.log(`  ✓ Geometria encontrada em geoareatema: ${item.tema || item.nomeimovel || 'sem nome'}`);
      return item.geoareatema;
    }
    if (item.areatotal) {
      console.log(`  ✓ Geometria encontrada em areatotal: ${item.nomeimovel || 'sem nome'}`);
      return item.areatotal;
    }
  }

  console.log(`  ⚠ Nenhuma geometria encontrada nos ${loteData.result.length} items`);
  return null;
}

// Atualiza cada propriedade com sua geometria
const updateStmt = db.prepare('UPDATE properties SET geometry_wkt = ? WHERE id = ?');

let updated = 0;
for (const [propId, loteId] of Object.entries(propertyMapping)) {
  const geometry = extractGeometry(loteId);
  
  if (geometry) {
    updateStmt.run(geometry, propId);
    console.log(`✓ Geometria atualizada para ${propId} (${loteId})`);
    updated++;
  } else {
    console.log(`⚠ Geometria não encontrada para ${propId}`);
  }
}

console.log(`\n✅ Migração concluída! ${updated} propriedades atualizadas.`);

// Fecha o banco
db.close();
