import SearchForm from "../shared/search-form";
import AppointmentPreview from "../appointments/appointment-preview";

export function HeroSection() {
  return (
    <section
      id="find-doctor"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-center md:justify-start">
            <div className="inline-block px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 font-semibold text-sm">
              ✨ Simplifiez votre santé
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight text-center md:text-left">
            Prenez rendez-vous avec votre{" "}
            <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              médecin
            </span>{" "}
            en quelques clics
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed text-center md:text-left">
            Trouvez le bon praticien, consultez les disponibilités en temps réel
            et réservez votre consultation en toute simplicité.
          </p>

          <SearchForm />
        </div>
        <AppointmentPreview />
      </div>
    </section>
  );
}
