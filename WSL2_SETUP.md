# 🐧 Guia de Setup no WSL 2 (Windows)

Este guia ajuda você a configurar o ambiente de desenvolvimento no Windows usando WSL 2 + Docker Desktop.

## ⚙️ Pré-requisitos

### 1. Instalar WSL 2
```powershell
# No PowerShell como Administrador
wsl --install
```

Ou se já tiver WSL 1, atualize para WSL 2:
```powershell
wsl --set-default-version 2
wsl --set-version Ubuntu 2
```

### 2. Instalar Docker Desktop
1. Baixe: https://www.docker.com/products/docker-desktop/
2. Instale e reinicie o Windows
3. Abra o Docker Desktop

### 3. **IMPORTANTE**: Ativar Integração WSL 2

No Docker Desktop:
1. Clique no ícone de configurações (⚙️)
2. Vá em **Resources** → **WSL Integration**
3. ✅ Ative **Enable integration with my default WSL distro**
4. ✅ Ative sua distro (ex: Ubuntu)
5. Clique em **Apply & Restart**

![Docker WSL Integration](https://docs.docker.com/desktop/images/wsl-enable.png)

### 4. Verificar se Docker funciona no WSL

Abra o terminal WSL (Ubuntu) e teste:
```bash
# Deve mostrar a versão
docker --version

# Deve mostrar a versão (com ou sem hífen)
docker-compose --version
# OU
docker compose version

# Testar se funciona
docker run hello-world
```

Se aparecer o erro **"docker: command not found"** ou **"docker-compose could not be found"**:
- ❌ A integração WSL não está ativada
- Volte ao passo 3 e ative a integração

## 🚀 Setup do Projeto

### 1. Clonar Repositório (no WSL)
```bash
# Sempre trabalhe dentro do filesystem do WSL (/home/seu_usuario)
# NÃO use /mnt/c/ (muito lento)

cd ~
git clone https://github.com/seu-usuario/fono.git
cd fono
```

### 2. Instalar Dependências

#### Ruby
```bash
# Instalar rbenv
sudo apt update
sudo apt install -y git curl libssl-dev libreadline-dev zlib1g-dev \
  autoconf bison build-essential libyaml-dev libreadline-dev \
  libncurses5-dev libffi-dev libgdbm-dev

curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash

# Adicionar ao ~/.bashrc
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc

# Instalar Ruby 3.2
rbenv install 3.2.0
rbenv global 3.2.0

# Verificar
ruby --version
```

#### Node.js
```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Instalar Node 20
nvm install 20
nvm use 20

# Verificar
node --version
npm --version
```

### 3. Executar Setup Inicial
```bash
cd ~/fono

# Script unificado faz tudo
./bin/dev
```

## 🐛 Troubleshooting

### Problema: "docker-compose: command not found"

**Causa**: Integração WSL 2 não ativada no Docker Desktop

**Solução**:
1. Abra Docker Desktop no Windows
2. Settings → Resources → WSL Integration
3. Ative sua distro
4. Apply & Restart
5. Reinicie o terminal WSL

### Problema: "Cannot connect to Docker daemon"

**Causa**: Docker Desktop não está rodando

**Solução**:
```bash
# No Windows, inicie o Docker Desktop
# Aguarde aparecer o ícone na bandeja do sistema

# Verifique no WSL
docker ps
```

### Problema: Performance muito lenta

**Causa**: Projeto em `/mnt/c/` (filesystem do Windows)

**Solução**:
```bash
# Mova projeto para o filesystem do WSL
cd ~
git clone <seu-repo>
cd fono
./bin/dev
```

**Performance**:
- ✅ `/home/usuario/` - Rápido (filesystem nativo do WSL)
- ❌ `/mnt/c/Users/...` - Lento (acesso cross-filesystem)

### Problema: "Port already in use"

```bash
# Descobrir processo na porta
lsof -i :3001
lsof -i :4000

# Matar processo
kill -9 <PID>

# Ou matar todos Rails/Node
pkill -f "rails server"
pkill -f "next dev"
```

### Problema: "Permission denied" ao executar ./bin/dev

```bash
# Tornar executável
chmod +x ./bin/dev
chmod +x ./bin/stop
```

### Problema: PostgreSQL não conecta

```bash
# Verificar se container está rodando
docker ps

# Ver logs
docker logs fono_postgres

# Testar conexão
docker exec -it fono_postgres psql -U postgres
```

## 🔧 Ferramentas Recomendadas

### VS Code no Windows
1. Instale VS Code: https://code.visualstudio.com/
2. Instale extensão **WSL** (ms-vscode-remote.remote-wsl)
3. Conecte ao WSL:
   - Abra VS Code
   - Ctrl+Shift+P
   - Digite "WSL: Connect to WSL"
   - Ou abra diretório: `code .` no terminal WSL

### Windows Terminal
- Melhor que o terminal padrão
- Download: Microsoft Store → "Windows Terminal"
- Configuração: Padrão = WSL (Ubuntu)

## 📊 Verificação Final

Execute estes comandos para garantir que tudo está funcionando:

```bash
# 1. Docker funcionando
docker --version
docker ps

# 2. Ruby instalado
ruby --version
bundle --version

# 3. Node instalado
node --version
npm --version

# 4. Projeto clonado no lugar certo
pwd
# Deve mostrar: /home/seu_usuario/fono (NÃO /mnt/c/...)

# 5. Permissões OK
ls -la bin/dev
# Deve mostrar: -rwxr-xr-x (x = executável)

# 6. Iniciar tudo
./bin/dev
```

Se todos os comandos funcionarem, está pronto! 🎉

## 🔗 Links Úteis

- [WSL 2 Docs](https://docs.microsoft.com/windows/wsl/)
- [Docker Desktop WSL 2](https://docs.docker.com/desktop/wsl/)
- [VS Code + WSL](https://code.visualstudio.com/docs/remote/wsl)
- [Best Practices WSL](https://docs.microsoft.com/windows/wsl/setup/environment)

## ⚡ Dicas de Performance

1. **Sempre trabalhe no filesystem do WSL** (`/home/`) não em `/mnt/c/`
2. **Use VS Code Remote WSL** para editar arquivos direto no WSL
3. **Configure git** no WSL (não use git do Windows):
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu@email.com"
   ```
4. **Desative antivírus** na pasta do projeto (se necessário)
5. **Aumente RAM do WSL** se tiver disponível:
   ```powershell
   # Criar arquivo C:\Users\SeuUsuario\.wslconfig
   [wsl2]
   memory=8GB
   processors=4
   ```

---

**Precisando de ajuda? Abra uma issue no GitHub!**
