# Gov.br Website com Painel Administrativo

## Descrição
Website gov.br replicado com sistema de login e painel administrativo para capturar e visualizar dados de CPF.

## Funcionalidades
- Login com CPF e senha (sem validação)
- Dados salvos automaticamente na pasta do projeto
- Painel administrativo para visualizar logs
- Redirecionamento configurável do botão "Iniciar"
- Design responsivo para PC e mobile

## Instalação e Execução

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar o servidor
```bash
npm start
```

### 3. Acessar o site
- Site principal: http://localhost:3000
- Painel administrativo: http://localhost:3000/admin

## Arquivos importantes
- `cpf_logs.txt` - Todos os CPFs logados são salvos aqui
- `server.js` - Servidor Node.js que gerencia os dados
- `index.html` - Página principal do site
- `admin.html` - Painel administrativo
- `script.js` - Lógica JavaScript do frontend
- `style.css` - Estilos CSS

## Como usar
1. Inicie o servidor com `npm start`
2. Acesse http://localhost:3000
3. Clique em "Entrar" e faça login com CPF e senha
4. Os dados são automaticamente salvos em `cpf_logs.txt`
5. Acesse o painel administrativo em http://localhost:3000/admin para visualizar os logs
6. Configure a URL de redirecionamento no painel administrativo

## Observações
- O servidor cria automaticamente o arquivo `cpf_logs.txt` na raiz do projeto
- O painel administrativo atualiza os logs a cada 10 segundos
- Em caso de falha do servidor, os dados ficam salvos no localStorage do navegador
- Adicione a imagem `govbr-logo.png` na pasta do projeto para o logo aparecer corretamente
