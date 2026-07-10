# Regras de qualidade da landing IGUITECH

Este projeto e uma landing page estatica em HTML, CSS e JavaScript. Regras voltadas a React,
TypeScript, backend, banco de dados, autenticacao e autorizacao devem ser aplicadas ao app
`app.iguitech.com`, nao a esta landing.

## Regras aplicaveis nesta landing

- Evitar duplicacao de logica em `script.js`; extrair utilitarios para DOM, tracking, validacao e chat.
- Nao renderizar conteudo de usuario com `innerHTML`; usar `textContent`, `append` e elementos criados via DOM.
- Manter imagens otimizadas e usar `loading="lazy"` em imagens fora do primeiro viewport.
- Validar uploads locais do chat por tipo e tamanho antes de processar ou enviar.
- Nao expor chaves, tokens, senhas ou endpoints internos no JavaScript publico.
- Manter `.gitignore` com `.env`, certificados, builds, coverage e dependencias locais.
- Manter `robots.txt`, meta description e Open Graph atualizados.
- Rastrear erros importantes sem registrar dados pessoais sensiveis.
- Usar headers de seguranca quando o deploy permitir: CSP, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy e Permissions-Policy.

## Regras nao aplicaveis nesta landing

- React.memo, useCallback, useMemo, hooks, Context API, prop drilling, interfaces e tipos TypeScript.
- SQL injection, ORM, CSRF, rotas autenticadas, permissoes por papel e gerenciamento de senhas.
- Logs estruturados de backend, requestId, userId e middlewares de autorizacao.
- `npm audit`, exceto se o projeto passar a usar dependencias npm.

## Pendencias dependentes de infraestrutura

- No GitHub Pages nao ha controle total de headers HTTP. Para aplicar CSP e demais headers em producao,
  usar deploy via Docker/EasyPanel com `nginx.conf`, Cloudflare, Netlify ou Vercel.
- Para cache imutavel com expiracao longa, manter versionamento nos nomes ou queries de arquivos estaticos.
