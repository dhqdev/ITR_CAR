import os
import json
import webbrowser
import argparse
import geopandas as gpd
import folium
from folium import plugins
from shapely import wkt
from datetime import datetime, timedelta
import requests
from requests.auth import HTTPBasicAuth

# -------------------------------------------------------------------
# CONFIGURAÇÃO
# -------------------------------------------------------------------
# Seu ID confirmado
COPERNICUS_INSTANCE_ID = "8eceb2bc-c7fd-4221-848f-0d2ff4d95bc8"

# Credenciais Copernicus (você precisa criar uma conta em https://dataspace.copernicus.eu/)
# Substitua com suas credenciais reais
COPERNICUS_CLIENT_ID = "seu_client_id_aqui"
COPERNICUS_CLIENT_SECRET = "seu_client_secret_aqui"

# -------------------------------------------------------------------
# LEITURA DE DADOS
# -------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_CLEAN_PATH = os.path.join(BASE_DIR, "imovel_dados_clean.json")

def load_local_data(path: str = JSON_CLEAN_PATH) -> dict:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Arquivo {path} não encontrado.")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def select_from_list(prompt: str, options: list[str]) -> int:
    print(f"\n{prompt}")
    for i, opt in enumerate(options, 1):
        print(f"  {i}. {opt}")
    while True:
        try:
            i = int(input("Digite o número: ").strip())
            if 1 <= i <= len(options): return i - 1
        except ValueError: pass
        print("Inválido.")

def extract_imoveis_for_lote(lote_obj: dict) -> list[dict]:
    resultados = lote_obj.get("result", [])
    if not isinstance(resultados, list): return []
    grupos = {}
    for item in resultados:
        imovel_id = item.get("identificadorimovel") or item.get("codigoimovel") or "imovel"
        grupos.setdefault(imovel_id, []).append(item)
    imoveis = []
    for imovel_id, itens in grupos.items():
        nome = next((it[k] for k in ("nomeimovel", "tema") for it in itens if it.get(k)), None)
        label = f"{imovel_id} - {nome}" if nome else str(imovel_id)
        imoveis.append({"id": imovel_id, "label": label, "itens": itens})
    return imoveis

def pick_geometry_wkt(imovel_itens: list[dict]):
    tema_prioridade = ["Área do Imovel", "Área Líquida do Imóvel", "APP Total", "Área Consolidada"]
    for tema in tema_prioridade:
        for it in imovel_itens:
            if it.get("tema") == tema and it.get("geoareatema"): return it["geoareatema"], f"geo ({tema})"
    for it in imovel_itens:
        if it.get("geoareatema"): return it["geoareatema"], "geoareatema"
        if it.get("areatotal"): return it["areatotal"], "areatotal"
        if it.get("poligonoAreaImovel"): return it["poligonoAreaImovel"], "poligonoAreaImovel"
    return None, None

def create_geodataframe_from_wkt(wkt_string: str, nome_imovel: str):
    try:
        geom = wkt.loads(wkt_string)
        return gpd.GeoDataFrame([{"nome": nome_imovel}], geometry=[geom], crs="EPSG:4326")
    except Exception as e:
        print(f"Erro WKT: {e}")
        return None

# -------------------------------------------------------------------
# FUNÇÕES PARA API COPERNICUS
# -------------------------------------------------------------------
def get_access_token():
    """Obtém token de acesso da API Copernicus"""
    try:
        token_url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
        data = {
            "grant_type": "client_credentials",
            "client_id": COPERNICUS_CLIENT_ID,
            "client_secret": COPERNICUS_CLIENT_SECRET
        }
        response = requests.post(token_url, data=data)
        response.raise_for_status()
        return response.json()["access_token"]
    except Exception as e:
        print(f"Erro ao obter token: {e}")
        return None

def get_available_dates(bbox, start_date=None, end_date=None, max_cloud_cover=30):
    """
    Busca datas disponíveis de imagens Sentinel-2 L2A para a área especificada
    bbox: [minx, miny, maxx, maxy] em EPSG:4326
    """
    if start_date is None:
        start_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')
    if end_date is None:
        end_date = datetime.now().strftime('%Y-%m-%d')
    
    token = get_access_token()
    if not token:
        print("Não foi possível obter token. Usando datas padrão.")
        return get_default_dates()
    
    try:
        # API de busca do Copernicus Data Space
        search_url = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"
        
        # Constrói a geometria para busca
        geom_wkt = f"POLYGON(({bbox[0]} {bbox[1]},{bbox[2]} {bbox[1]},{bbox[2]} {bbox[3]},{bbox[0]} {bbox[3]},{bbox[0]} {bbox[1]}))"
        
        params = {
            "$filter": f"Collection/Name eq 'SENTINEL-2' and "
                      f"Attributes/OData.CSC.StringAttribute/any(att:att/Name eq 'productType' and att/OData.CSC.StringAttribute/Value eq 'S2MSI2A') and "
                      f"OData.CSC.Intersects(area=geography'SRID=4326;{geom_wkt}') and "
                      f"ContentDate/Start ge {start_date}T00:00:00.000Z and "
                      f"ContentDate/Start le {end_date}T23:59:59.999Z and "
                      f"Attributes/OData.CSC.DoubleAttribute/any(att:att/Name eq 'cloudCover' and att/OData.CSC.DoubleAttribute/Value le {max_cloud_cover})",
            "$orderby": "ContentDate/Start desc",
            "$top": 100
        }
        
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(search_url, params=params, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        dates = []
        
        for item in data.get('value', []):
            date_str = item.get('ContentDate', {}).get('Start', '')
            if date_str:
                # Extrai apenas a data (YYYY-MM-DD)
                date_only = date_str.split('T')[0]
                cloud_cover = next((attr['Value'] for attr in item.get('Attributes', []) 
                                  if attr.get('Name') == 'cloudCover'), 0)
                dates.append({
                    'date': date_only,
                    'datetime': date_str,
                    'cloud_cover': cloud_cover,
                    'id': item.get('Id', '')
                })
        
        # Remove datas duplicadas (mantém a com menor cobertura de nuvens)
        unique_dates = {}
        for item in dates:
            date = item['date']
            if date not in unique_dates or item['cloud_cover'] < unique_dates[date]['cloud_cover']:
                unique_dates[date] = item
        
        # Ordena por data decrescente
        sorted_dates = sorted(unique_dates.values(), key=lambda x: x['date'], reverse=True)
        
        print(f"✓ Encontradas {len(sorted_dates)} datas disponíveis")
        return sorted_dates
        
    except Exception as e:
        print(f"Erro ao buscar datas: {e}")
        print("Usando datas padrão...")
        return get_default_dates()

def get_default_dates():
    """Retorna datas padrão caso a API falhe"""
    dates = []
    base_date = datetime.now()
    for i in range(12):  # Últimos 12 meses, aproximadamente
        date = base_date - timedelta(days=i*30)
        dates.append({
            'date': date.strftime('%Y-%m-%d'),
            'datetime': date.strftime('%Y-%m-%dT12:00:00.000Z'),
            'cloud_cover': 0,
            'id': ''
        })
    return dates

# -------------------------------------------------------------------
# FUNÇÃO PARA CRIAR MAPA COM DATA ESPECÍFICA
# -------------------------------------------------------------------
def create_map_with_date(gdf, selected_date, available_dates, filename="mapa_final.html"):
    """Cria mapa com uma data específica selecionada"""
    minx, miny, maxx, maxy = gdf.total_bounds
    pad_x, pad_y = (maxx - minx) * 0.1, (maxy - miny) * 0.1
    bounds = [[miny - pad_y, minx - pad_x], [maxy + pad_y, maxx + pad_x]]
    center = [(miny + maxy)/2, (minx + maxx)/2]
    
    print(f"\n📅 Carregando mapa para data: {selected_date}")
    
    # 1. Mapa Base
    m = folium.Map(location=center, zoom_start=15, tiles=None)
    
    # Adiciona tile base (OpenStreetMap)
    folium.TileLayer('OpenStreetMap', name='Mapa Base', show=False).add_to(m)
    
    # Adiciona ESRI Satellite como referência visual
    folium.TileLayer(
        tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attr='Esri',
        name='🌍 Satélite de Referência (ESRI)',
        overlay=False,
        control=True,
        show=True
    ).add_to(m)

    # -----------------------------------------------------------
    # CAMADA SENTINEL-2 L2A (10m de resolução)
    # -----------------------------------------------------------
    wms_url = f"https://sh.dataspace.copernicus.eu/ogc/wms/{COPERNICUS_INSTANCE_ID}"
    
    # Camada Sentinel-2 com a data selecionada
    sentinel_layer = folium.raster_layers.WmsTileLayer(
        url=wms_url,
        layers='TRUE_COLOR',
        name='🛰️ Sentinel-2 L2A (10m)',
        format='image/png',
        transparent=False,
        version='1.3.0',
        attr='© Copernicus Sentinel-2 L2A',
        overlay=True,
        control=True,
        show=True,
        maxcc=30,
        time=f"{selected_date}/{selected_date}"
    )
    sentinel_layer.add_to(m)

    # -----------------------------------------------------------
    # CONTORNO DO IMÓVEL
    # -----------------------------------------------------------
    folium.GeoJson(
        gdf,
        style_function=lambda x: {
            "fill": False, 
            "color": "#FF0000", 
            "weight": 3,
            "opacity": 0.8
        },
        tooltip="Área do Imóvel"
    ).add_to(m)

    # -----------------------------------------------------------
    # INFO BOX
    # -----------------------------------------------------------
    date_info = next((d for d in available_dates if d['date'] == selected_date), {'cloud_cover': 0})
    info_html = f"""
    <div style="
        position: fixed; 
        bottom: 10px; 
        right: 10px; 
        z-index: 9999; 
        background: white; 
        padding: 12px; 
        border-radius: 8px; 
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 11px;
        max-width: 250px;
    ">
        <div style="font-weight: bold; margin-bottom: 5px; color: #2E7D32;">
            ℹ️ Informações da Imagem
        </div>
        <div style="line-height: 1.6; color: #555;">
            <strong>Satélite:</strong> Sentinel-2<br>
            <strong>Nível:</strong> L2A (Bottom of Atmosphere)<br>
            <strong>Resolução:</strong> 10 metros<br>
            <strong>Bandas:</strong> RGB (True Color)<br>
            <strong>Data:</strong> {selected_date}<br>
            <strong>Nuvens:</strong> {date_info['cloud_cover']:.1f}%<br>
            <strong>Fonte:</strong> Copernicus Data Space
        </div>
    </div>
    """
    m.get_root().html.add_child(folium.Element(info_html))

    # Controles de Mapa
    folium.LayerControl(collapsed=False).add_to(m)
    plugins.Fullscreen().add_to(m)
    
    # Finalização
    m.fit_bounds(bounds)
    m.save(filename)
    print(f"✓ Mapa salvo em: {os.path.abspath(filename)}")
    return filename

# -------------------------------------------------------------------
# MAIN COM LOOP INTERATIVO
# -------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--lote", help="ID do lote")
    parser.add_argument("--imovel", help="ID do imovel")
    parser.add_argument("--auto", action="store_true", help="Auto select")
    args = parser.parse_args()

    try:
        data = load_local_data()
        lotes = list(data.keys())
        
        # Lógica de seleção simplificada
        if args.auto and lotes: lote_id = lotes[0]
        elif args.lote in lotes: lote_id = args.lote
        else: lote_id = lotes[select_from_list("Selecione Lote:", lotes)]
        
        lote_obj = data[lote_id]
        imoveis = extract_imoveis_for_lote(lote_obj)
        
        if args.auto and imoveis: imv = imoveis[0]
        elif args.imovel:
            imv = next((i for i in imoveis if args.imovel in i["label"]), None)
            if not imv: 
                print("Imóvel não achado.")
                return
        else:
            imv = imoveis[select_from_list(f"Imóveis em {lote_id}:", [i["label"] for i in imoveis])]

        wkt_geom, origem = pick_geometry_wkt(imv["itens"])
        if not wkt_geom:
            print("Sem geometria.")
            return
            
        print(f"\nProcessando: {imv['label']}...")
        gdf = create_geodataframe_from_wkt(wkt_geom, imv["label"])
        
        # Busca datas disponíveis
        minx, miny, maxx, maxy = gdf.total_bounds
        bbox = [minx, miny, maxx, maxy]
        
        print("\n🔍 Buscando datas disponíveis na API Sentinel-2...")
        available_dates = get_available_dates(bbox)
        
        if not available_dates:
            print("⚠️ Nenhuma data disponível encontrada")
            return

        print(f"\n✓ Encontradas {len(available_dates)} datas disponíveis")
        
        # Gera e abre o mapa com a data mais recente automaticamente
        print("\n🚀 Gerando mapa com a data mais recente...")
        latest_date = available_dates[0]['date']
        map_file = create_map_with_date(gdf, latest_date, available_dates)
        
        print(f"\n✓ Mapa salvo em: {os.path.abspath(map_file)}")
        print("🌐 Abrindo mapa no navegador...")
        webbrowser.open(f"file://{os.path.abspath(map_file)}")
        
        # LOOP PRINCIPAL
        primeira_vez = True
        while True:
            if primeira_vez:
                print("\n" + "="*60)
                print("✅ Mapa aberto! Use o seletor de datas no canto superior esquerdo")
                print("   para mudar a data diretamente no navegador.")
                print("="*60)
                primeira_vez = False
            
            print("\n" + "="*60)
            print("🗓️  MENU DE OPÇÕES")
            print("="*60)
            
            # Mostra as datas disponíveis
            print("\nDatas disponíveis:")
            for i, date_info in enumerate(available_dates[:10], 1):  # Mostra só as 10 primeiras
                date_str = date_info['date']
                cloud = date_info['cloud_cover']
                marker = "⭐" if i == 1 else "  "
                print(f"{marker} {i:2d}. {date_str}  (nuvens: {cloud:5.1f}%)")
            
            if len(available_dates) > 10:
                print(f"    ... e mais {len(available_dates) - 10} datas disponíveis")
            
            print("\nOpções:")
            print("  [número] - Gerar novo mapa com data selecionada")
            print("  [r] - Reabrir mapa atual no navegador")
            print("  [0] - Sair")
            
            try:
                escolha = input("\nDigite sua escolha: ").strip().lower()
                
                if escolha == "0":
                    print("\n👋 Encerrando sistema...")
                    break
                
                if escolha == "r":
                    print("🌐 Reabrindo mapa no navegador...")
                    webbrowser.open(f"file://{os.path.abspath(map_file)}")
                    print("✓ Mapa reaberto")
                    continue
                
                idx = int(escolha) - 1
                
                if 0 <= idx < len(available_dates):
                    selected_date_info = available_dates[idx]
                    selected_date = selected_date_info['date']
                    
                    print(f"\n🚀 Gerando novo mapa para {selected_date}...")
                    # Gera o mapa com a data selecionada
                    map_file = create_map_with_date(gdf, selected_date, available_dates)
                    
                    print(f"✓ Mapa salvo em: {os.path.abspath(map_file)}")
                    print("🌐 Abrindo mapa no navegador...")
                    webbrowser.open(f"file://{os.path.abspath(map_file)}")
                    print("✓ Mapa aberto com sucesso!")
                else:
                    print("❌ Opção inválida! Digite um número entre 1 e", len(available_dates))
                    
            except ValueError:
                print("❌ Entrada inválida! Digite um número válido.")
            except KeyboardInterrupt:
                print("\n\n👋 Sistema interrompido pelo usuário.")
                break

    except Exception as e:
        print(f"❌ Erro: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()