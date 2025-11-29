/**
 * Script de teste para verificar se a API retorna geometry_wkt
 */

const { db, rowToProperty } = require('./server/database');

console.log('\n🔍 TESTANDO API - Verificação de geometry_wkt\n');

// Teste 1: Buscar diretamente do banco
console.log('📊 Teste 1: Leitura direta do banco de dados');
const row = db.prepare('SELECT * FROM properties WHERE id = ?').get('prop_001');
console.log('   Colunas retornadas:', Object.keys(row).length);
console.log('   geometry_wkt presente?', row.geometry_wkt ? '✓ SIM' : '✗ NÃO');
if (row.geometry_wkt) {
  console.log('   Tamanho:', row.geometry_wkt.length, 'caracteres');
  console.log('   Início:', row.geometry_wkt.substring(0, 50), '...\n');
}

// Teste 2: Conversão com rowToProperty
console.log('📊 Teste 2: Conversão com rowToProperty()');
const property = rowToProperty(row);
console.log('   Propriedades retornadas:', Object.keys(property).length);
console.log('   geometry_wkt presente?', property.geometry_wkt ? '✓ SIM' : '✗ NÃO');
if (property.geometry_wkt) {
  console.log('   Tamanho:', property.geometry_wkt.length, 'caracteres');
  console.log('   Início:', property.geometry_wkt.substring(0, 50), '...\n');
}

// Teste 3: Listar todas as propriedades
console.log('📊 Teste 3: Listar todas as propriedades');
const allRows = db.prepare('SELECT * FROM properties').all();
console.log('   Total de propriedades:', allRows.length);
allRows.forEach(r => {
  const p = rowToProperty(r);
  console.log(`   ${r.id}: geometry_wkt = ${p.geometry_wkt ? '✓' : '✗'} (${p.geometry_wkt ? p.geometry_wkt.length : 0} chars)`);
});

console.log('\n✅ Teste concluído!\n');
