## Refatoração — `src/routes/index.tsx`

A página inicial concentra ~220 linhas com 4 seções inline (Hero, Services Grid, How It Works, Footer), markup repetitivo e dados misturados com apresentação. Vou aplicar SRP (Single Responsibility) extraindo cada seção em seu próprio componente, e mover dados estáticos para constantes.

### Estrutura proposta

```text
src/
├── routes/index.tsx           # apenas Route config + composição
└── components/home/
    ├── HeroSection.tsx        # copy + CTAs + glass mockup
    ├── HeroMockup.tsx         # cartão de vidro flutuante (extraído do Hero)
    ├── TrustStrip.tsx         # lista de selos (Entrega/Pix/Sigilo)
    ├── ServicesGrid.tsx       # grid de serviços (recebe services via props)
    ├── ServiceCard.tsx        # card individual
    ├── HowItWorks.tsx         # 3 passos
    ├── SiteFooter.tsx         # footer
    └── home.data.ts           # TRUST_ITEMS, HOW_STEPS (constantes)
```

### Princípios aplicados

- **SRP**: cada componente cuida de uma seção/elemento visual.
- **Open/Closed**: `ServicesGrid` recebe `services` por prop — fácil de reusar/testar sem tocar no fetch.
- **DRY**: arrays inline (`TRUST_ITEMS`, `HOW_STEPS`) viram constantes tipadas em `home.data.ts`.
- **Baixa complexidade ciclomática**: `Index()` deixa de ter JSX aninhado de 160+ linhas e vira composição linear de 6 componentes.
- **Clean Code**: nomes auto-explicativos, props tipadas, sem mudança de comportamento, classes e animações idênticas.

### `routes/index.tsx` final (esqueleto)

```tsx
function Index() {
  const { data: services } = useSuspenseQuery(servicesQuery);
  return (
    <>
      <Background />
      <Header />
      <HeroSection />
      <ServicesGrid services={services} />
      <HowItWorks />
      <SiteFooter />
    </>
  );
}
```

### Garantias

- Zero mudança visual ou de comportamento (mesmo markup, mesmas classes Tailwind, mesmas animações).
- Mesmos imports de rota / loader / metadata preservados.
- TypeScript estrito mantido — props explicitamente tipadas a partir do retorno de `listServices`.

### Fora do escopo

Não vou refatorar `ScrollIntro`, `Header`, `Background`, rotas de pagamento ou server functions nesta passada — o pedido foi focado em "estrutura do código" da página atual. Posso fazer numa próxima etapa se quiser.
