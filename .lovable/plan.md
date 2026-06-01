
# Migração para Vite + React + JSX (Node.js)

## Avisos importantes
- Saímos do template TanStack Start. Recursos da Lovable que dependem dele (SSR, server functions, deploy em Edge, error boundary do template) **deixam de funcionar**.
- O preview da Lovable continua funcionando porque ela serve apps Vite normais, mas qualquer feature futura que precise de backend vai ter que ser reconstruída.
- A pasta `node_modules` e o `bun.lock` serão regerados.

## O que muda na infraestrutura

1. **Remover** arquivos específicos do TanStack Start:
   - `src/server.ts`, `src/start.ts`, `src/router.tsx`, `src/routeTree.gen.ts`
   - `src/routes/__root.tsx`, `src/lib/error-capture.ts`, `src/lib/error-page.ts`, `src/lib/config.server.ts`, `src/lib/api/`
   - `vite.config.ts` (substituído)
   - `tsconfig.json` (substituído por `jsconfig.json`)

2. **Trocar dependências em `package.json`**:
   - Remove: `@tanstack/react-start`, `@tanstack/react-router`, `@lovable.dev/vite-tanstack-config`, `nitro`, tudo de `@cloudflare/*`
   - Adiciona: `vite`, `@vitejs/plugin-react`, `react-router-dom`
   - Scripts viram `vite` / `vite build` / `vite preview` (Node.js padrão)

3. **Novos arquivos raiz**:
   - `index.html` (entry HTML do Vite)
   - `src/main.jsx` (bootstrap React + BrowserRouter)
   - `src/App.jsx` (define `<Routes>` com `react-router-dom`)
   - `vite.config.js` (plugin React + alias `@`)
   - `jsconfig.json` (path alias `@/*` para o editor)

## O que muda nas telas

4. **Converter todos os arquivos de rota e componentes** de `.tsx` → `.jsx` (conteúdo já é JSX puro, só renomear e ajustar imports):
   - `src/routes/*.tsx` → viram páginas em `src/pages/*.jsx`
   - `src/components/AppShell.tsx`, `BottomNav.tsx`, `ClientOnly.tsx`, `FloripaMap.tsx` → `.jsx`
   - `src/lib/app-store.ts`, `mock-data.ts`, `utils.ts` → `.js`

5. **Trocar API de roteamento** em todas as telas:
   - `@tanstack/react-router` → `react-router-dom`
   - `createFileRoute(...)({ component })` → `export default function Page()`
   - `<Link to="/x">` → `<Link to="/x">` (mesma sintaxe, outro pacote)
   - `useNavigate()` → versão do react-router-dom (`navigate("/x")` em vez de `navigate({ to: "/x" })`)
   - `useLocation().pathname` → igual no react-router-dom

6. **shadcn/ui**: mantém os componentes em `.tsx` (são genéricos e não atrapalham — Vite compila TS e JSX juntos sem problema). Se você fizer questão de 0% TS, posso converter também, mas multiplica o trabalho por ~40 arquivos.

## Bugs mantidos corrigidos
- Continuam ativos os fixes anteriores em `map`, `home` e `route-result` para que a rota gerada reflita origem/destino escolhidos pelo usuário.

## Como rodar depois
```bash
bun install
bun run dev      # vite dev server em Node.js
bun run build    # build estático
bun run preview  # servir o build
```

## Sobre o Figma
Quando você mandar os screenshots/link, eu aplico em cima da nova base já em JSX.

---

**Confirma esse plano?** Em especial o ponto 6 (manter shadcn em .tsx) — se quiser tudo .jsx mesmo, me diz que eu incluo.
