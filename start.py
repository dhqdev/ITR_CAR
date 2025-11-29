#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Inicialização do Sistema ITR/CAR
Inicia o servidor backend e o frontend React automaticamente
"""

import os
import sys
import subprocess
import time
import platform
from pathlib import Path

# Cores ANSI para output colorido
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_colored(text, color):
    """Imprime texto colorido"""
    print(f"{color}{text}{Colors.END}")

def print_header(text, color=Colors.CYAN):
    """Imprime um cabeçalho formatado"""
    separator = "=" * 61
    print_colored(f"\n{separator}", color)
    print_colored(f"  {text}", color)
    print_colored(separator, color)

def check_node():
    """Verifica se o Node.js está instalado"""
    try:
        result = subprocess.run(['node', '--version'], 
                              capture_output=True, 
                              text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print_colored(f"✓ Node.js encontrado: {version}", Colors.GREEN)
            return True
    except FileNotFoundError:
        pass
    
    print_colored("✗ Node.js não está instalado!", Colors.RED)
    print_colored("  Instale o Node.js em: https://nodejs.org/", Colors.YELLOW)
    return False

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    node_modules = Path("node_modules")
    
    if not node_modules.exists():
        print_colored("📦 Instalando dependências...", Colors.YELLOW)
        
        # Usa shell=True no Windows
        is_windows = platform.system() == 'Windows'
        if is_windows:
            result = subprocess.run('npm install', shell=True)
        else:
            result = subprocess.run(['npm', 'install'])
            
        if result.returncode != 0:
            print_colored("✗ Erro ao instalar dependências!", Colors.RED)
            return False
        print_colored("✓ Dependências instaladas com sucesso!", Colors.GREEN)
    else:
        print_colored("✓ Dependências já instaladas", Colors.GREEN)
    
    return True

def check_database():
    """Verifica se o banco de dados existe, se não, inicializa"""
    db_path = Path("server/itr_car.db")
    
    if not db_path.exists():
        print_colored("🗄️  Inicializando banco de dados...", Colors.YELLOW)
        result = subprocess.run(['node', 'server/database.js'])
        if result.returncode != 0:
            print_colored("✗ Erro ao inicializar banco de dados!", Colors.RED)
            return False
        print_colored("✓ Banco de dados inicializado!", Colors.GREEN)
    else:
        print_colored("✓ Banco de dados encontrado", Colors.GREEN)
    
    return True

def start_backend():
    """Inicia o servidor backend"""
    print_header("📡 INICIANDO SERVIDOR BACKEND (API)", Colors.CYAN)
    print_colored("  Porta: http://localhost:5000", Colors.WHITE)
    print_colored("  Status: Iniciando...\n", Colors.YELLOW)
    
    # Determina o shell apropriado baseado no OS
    is_windows = platform.system() == 'Windows'
    
    if is_windows:
        # Windows: usa cmd com shell=True
        backend_process = subprocess.Popen(
            'npm run server',
            shell=True,
            creationflags=subprocess.CREATE_NEW_CONSOLE
        )
    else:
        # Linux/Mac: usa terminal padrão
        backend_process = subprocess.Popen(
            ['npm', 'run', 'server'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
    
    # Aguarda o servidor iniciar
    print_colored("  Aguardando servidor inicializar...", Colors.YELLOW)
    time.sleep(3)
    
    print_colored("✓ Servidor backend iniciado!", Colors.GREEN)
    return backend_process

def start_frontend():
    """Inicia o servidor frontend"""
    print_header("🌐 INICIANDO FRONTEND REACT", Colors.MAGENTA)
    print_colored("  Porta: http://localhost:3000", Colors.WHITE)
    print_colored("  Status: Iniciando...\n", Colors.YELLOW)
    
    # O frontend sempre abre no navegador automaticamente
    # Usa shell=True no Windows para encontrar npm corretamente
    is_windows = platform.system() == 'Windows'
    
    if is_windows:
        result = subprocess.run('npm start', shell=True)
    else:
        result = subprocess.run(['npm', 'start'])
    
    return result

def show_credentials():
    """Mostra as credenciais de acesso"""
    print()
    print_colored("👤 CREDENCIAIS DE ACESSO:", Colors.YELLOW)
    print_colored("   • Admin:    admin / admin123", Colors.WHITE)
    print_colored("   • Auditor:  auditor / auditor123", Colors.WHITE)
    print_colored("   • Analista: analista / analista123", Colors.WHITE)
    print()

def main():
    """Função principal"""
    print_colored(f"\n{Colors.BOLD}🚀 INICIANDO SISTEMA ITR/CAR...{Colors.END}\n", Colors.GREEN)
    
    # Verifica Node.js
    if not check_node():
        sys.exit(1)
    
    # Verifica dependências
    if not check_dependencies():
        sys.exit(1)
    
    # Verifica banco de dados
    if not check_database():
        sys.exit(1)
    
    print()
    
    # Inicia o backend
    backend_process = start_backend()
    
    # Mostra credenciais
    show_credentials()
    
    print_colored("✅ Sistema iniciado com sucesso!", Colors.GREEN)
    print_colored("📌 Pressione Ctrl+C para encerrar\n", Colors.CYAN)
    
    try:
        # Inicia o frontend (este processo bloqueia até ser encerrado)
        start_frontend()
    except KeyboardInterrupt:
        print_colored("\n\n🛑 Encerrando sistema...", Colors.YELLOW)
    finally:
        # Encerra o processo do backend
        if backend_process:
            backend_process.terminate()
            backend_process.wait()
        
        print_colored("🛑 Sistema encerrado.\n", Colors.RED)

if __name__ == "__main__":
    # Verifica se está no diretório correto
    if not Path("package.json").exists():
        print_colored("✗ Execute este script no diretório raiz do projeto!", Colors.RED)
        sys.exit(1)
    
    main()
