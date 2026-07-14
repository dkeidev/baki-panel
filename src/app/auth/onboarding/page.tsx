import OnboardingForm from "./_components/OnboardingForm";
import OnboardingHeader from "./_components/OnboardingHeader";

export default async function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <OnboardingHeader />

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg space-y-8 p-8 rounded-2xl border border-outline/10 bg-card/85 backdrop-blur-md shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-on-surface">
              Crea tu Tienda
            </h2>
            <p className="mt-2 text-xs text-on-surface-variant max-w-sm mx-auto">
              Registra los datos básicos de tu comercio para generar tu catálogo
              y empezar a recibir pedidos por WhatsApp.
            </p>
          </div>

          <OnboardingForm />
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="py-6 text-center text-xs text-on-surface-variant/70 border-t border-outline/5">
        &copy; {new Date().getFullYear()} Baki.lat. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
