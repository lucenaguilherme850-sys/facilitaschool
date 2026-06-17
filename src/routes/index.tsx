import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { Platforms } from "@/components/home/Platforms";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HowToOrder } from "@/components/home/HowToOrder";
import { Faq } from "@/components/home/Faq";
import { SiteFooter } from "@/components/home/SiteFooter";
import { listServices } from "@/lib/orders.functions";

const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: () => listServices(),
  staleTime: 5 * 60_000,
});

function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl mb-2">Não foi possível carregar</h1>
      <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
      <button
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="rounded-full bg-primary text-primary-foreground px-6 py-2.5"
      >
        Tentar novamente
      </button>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Facilit — Suas atividades feitas, sem cobrança de professor" },
      { name: "description", content: "Cansado de professor te enchendo o saco pra entregar atividade? A Facilit resolve por você: GoEnglish, Netescola e Revisa Goiás entregues no prazo, pagamento via Pix, 100% sigilo." },
      { property: "og:title", content: "Facilit — Suas atividades feitas, sem dor de cabeça" },
      { property: "og:description", content: "Pare de adiar atividade escolar. A gente executa por você — entrega no prazo, Pix e sigilo total." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: Index,
  errorComponent: RouteError,
  notFoundComponent: () => <div className="p-10 text-center">Página não encontrada.</div>,
});

function Index() {
  const { data: services } = useSuspenseQuery(servicesQuery);
  return (
    <>
      <Background />
      <Header />
      <HeroSection />
      <ServicesGrid services={services} />
      <Platforms />
      <HowItWorks />
      <HowToOrder />
      <Faq />
      <SiteFooter />
    </>
  );
}
