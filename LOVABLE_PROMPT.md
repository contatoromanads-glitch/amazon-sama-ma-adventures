# Prompt para Lovable — Ajustes Finais do Amazon Samaúma Lodge

Cole este prompt no Lovable para aplicar os ajustes que não foram feitos via código:

---

## PROMPT COMPLETO

O site Amazon Samaúma Lodge precisa dos seguintes ajustes finais. Aplique **todos** de uma vez:

### 1. Variável de Ambiente — Supabase Anon Key
No arquivo `src/integrations/supabase/client.ts`, as variáveis já estão configuradas para usar `import.meta.env.VITE_SUPABASE_URL` e `import.meta.env.VITE_SUPABASE_ANON_KEY`. Configure as variáveis de ambiente no painel do Lovable (Settings > Environment Variables):
- `VITE_SUPABASE_URL` = `https://pwfawrrvdvuufamrltzc.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = [cole aqui a sua anon key real do Supabase]

### 2. Página de Acomodações — Carregar dados do Supabase
Na página `src/pages/Accommodations.tsx`, substitua o array estático `rooms` por uma query do Supabase:

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Dentro do componente:
const { data: dbRooms = [] } = useQuery({
  queryKey: ["accommodations-public"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("accommodations")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) return [];
    return data;
  },
});

// Use dbRooms.length > 0 ? dbRooms : STATIC_FALLBACK para garantir que o site funciona mesmo sem dados no banco
```

### 3. Página Inicial (Index.tsx) — Carregar Depoimentos e FAQs do Supabase
Substitua os arrays estáticos `testimonials` e `faqs` por queries do Supabase (mesma abordagem acima), usando fallback para os dados estáticos se o banco retornar vazio.

### 4. Página de Acomodações — Converter para componente funcional
A página `Accommodations.tsx` está como arrow function `const Accommodations = () =>`. Precisa ser convertida para componente com hooks, pois agora usa `useQuery`.

### 5. Proteção da rota admin por role
No arquivo `src/components/admin/ProtectedRoute.tsx`, verificar se o `isAdmin` está funcionando. O usuário admin precisa ter o campo `app_metadata.role = "admin"` OU `user_metadata.role = "admin"` no Supabase.

Para definir um usuário como admin no Supabase:
- Vá em Authentication > Users > clique no usuário
- Em "User Metadata", adicione: `{"role": "admin"}`

### 6. Imagens com alt text ausente
Percorra as pages `Ecotourism.tsx` e `Fishing.tsx` e verifique que todas as tags `<img>` têm atributo `alt` descritivo preenchido (não vazio).

### 7. FAQ accordion — aria-expanded
No componente de FAQ em `Index.tsx` (o accordion manual com `openFaq`), adicionar `aria-expanded` no botão:
```tsx
<button
  aria-expanded={openFaq === i}
  aria-controls={`faq-answer-${i}`}
  ...
```
E no conteúdo: `id={`faq-answer-${i}`}`.

### 8. Botão Reserve Agora — mobile touch targets
Garantir que todos os botões de CTA (Reserve Agora, WhatsApp) tenham `min-height: 44px` para acessibilidade mobile (já devem ter, mas verificar).

### 9. Vercel / Netlify — _redirects para SPA
Criar arquivo `public/_redirects` com:
```
/* /index.html 200
```
Ou `public/vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
Isso evita erro 404 ao acessar URLs diretas como `/acomodacoes` após o deploy.

### 10. useAuth — dependência faltante no useEffect
No arquivo `src/hooks/useAuth.tsx`, o `onActivity` usa `user` mas ele está no array de deps comentado. Ajustar para não causar loop: mover a verificação de `user` para dentro do callback usando `useRef` para o estado atual do user.

---

## INSTRUÇÕES ADICIONAIS PARA O SUPABASE

Após aplicar o código, siga estes passos no Supabase Dashboard:

1. **Executar a migration SQL**: Vá em SQL Editor e execute o conteúdo de `supabase/migrations/001_initial_schema.sql`

2. **Criar usuário admin**:
   - Vá em Authentication > Users > Add User
   - Email: seu email de acesso
   - Password: senha forte (mínimo 12 caracteres)
   - Após criar, clique no usuário e adicione em App Metadata: `{"role": "admin"}`

3. **Storage bucket**: O SQL já cria o bucket `site-images`. Verifique em Storage > Buckets que ele aparece como público.

4. **Testar o painel**: Acesse `/admin/login` no site e faça login com o usuário criado.
