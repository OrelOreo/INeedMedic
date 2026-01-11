import { HOW_IT_WORKS_STEPS } from "@/lib/home";

export default function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      className="py-20 bg-linear-to-br from-emerald-50 to-teal-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Trois étapes simples pour votre rendez-vous
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {HOW_IT_WORKS_STEPS.map((item, index) => (
            <div key={index} className="relative">
              {index < 2 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-linear-to-r from-emerald-300 to-teal-300 -translate-x-1/2" />
              )}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-100">
                <div className="text-6xl font-bold bg-linear-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
