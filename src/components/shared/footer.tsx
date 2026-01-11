import { Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white">INeedMedic</span>
            </div>
            <p className="text-sm text-gray-400">
              Simplifiez vos rendez-vous médicaux avec notre plateforme
              intuitive et sécurisée.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link
                  href="#find-doctor"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Trouver un médecin
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Comment ça marche ?
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} INeedMedic. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
