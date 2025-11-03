## Fluxo de Autenticação (GraphQL)

O frontend utiliza Apollo Client + Context API para autenticação via GraphQL.

### Mutations / Queries utilizadas

```graphql
mutation LoginUser($email: String!, $password: String!) {
	loginUser(email: $email, password: $password) {
		user { id email admin }
		token
		errors
	}
}

query CurrentUser {
	currentUser { id email admin }
}
```

### Passos para testar (rota raiz agora é login)

1. Certifique-se de que o backend está rodando em `http://localhost:3001/graphql`.
2. Acesse `/` no frontend (login direto). A rota `/login` é redirecionada para `/`.
3. Informe email e senha válidos (ex: `admin@fono.com` / `admin123456`).
4. Ao autenticar, será redirecionado para `/home`.
5. O token JWT fica salvo em `localStorage` (chave `token`).

### Estrutura principal

| Arquivo | Função |
|---------|--------|
| `src/lib/apollo.ts` | Configura Apollo Client com header Authorization. |
| `src/context/AuthContext.tsx` | Gerencia estado de autenticação (login/logout/usuário). |
| `src/app/login/page.tsx` | Tela de login com formulário. |
| `src/app/home/page.tsx` | Tela protegida exibindo dados do usuário. |
| `src/lib/graphql.ts` | Definições de queries/mutations reutilizáveis. |

### Proteção de rotas & middleware

Implementado `middleware.ts`:
- Redireciona `/login` para `/`.
- Exige cookie `token` em `/home`.
- Cookie é criado no login (apenas para desenvolvimento, não seguro para produção).

Melhorias futuras para produção:
- Usar cookie httpOnly setado via resposta do backend.
- Adicionar verificação de expiração (`exp`) do JWT.
- Implementar refresh token.

### Logout

O botão "Sair" remove o token e redireciona para `/login`.

### Melhorias Futuras

- Persistir usuário em cache Apollo para evitar nova requisição.
- Renovação automática de token próximo do vencimento.
- Página de perfil e edição de senha.
- Uso de refresh token (exigiria mudança no backend).

# Fono - Frontend starter

Arquivo gerado automaticamente como um starter para reconstruir o frontend do projeto `fono`.
Este starter usa Next.js (App Router) + TypeScript + Tailwind CSS (v3) e Apollo Client.

Passos rápidos:
1. Descompacte o zip.
2. Entre na pasta: `cd fono-frontend-starter`
3. Rode: `npm install`
4. Rode: `npm run dev` (vai abrir em http://localhost:4000)

Observação:
- Eu escolhi Next 14 + React 18 + Tailwind 3 para evitar conflitos de peer-dependencies que ocorrem em ambientes com Next 15/React 19 e Tailwind 4.
- Se você quiser usar Tailwind 4 / Next 15, me avise e eu adapto o starter.
