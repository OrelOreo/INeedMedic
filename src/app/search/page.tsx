import PractitionerList from "@/components/search/practitionner-list";
import SearchForm from "@/components/search/search-form";
import { searchPractionnersByLocationAndSpeciality } from "@/lib/server-actions/index";

export default async function SearchPage(props: {
  searchParams?: Promise<{
    location?: string;
    specialty?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const practitioners = await searchPractionnersByLocationAndSpeciality(
    searchParams?.location || "",
    searchParams?.specialty || ""
  );

  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Trouvez votre praticien
        </h1>
        <p className="text-lg text-gray-600">
          {practitioners.length} praticien{practitioners.length > 1 ? "s" : ""}{" "}
          disponible{practitioners.length > 1 ? "s" : ""}
        </p>
      </div>
      <SearchForm />

      <PractitionerList practitioners={practitioners} />
    </main>
  );
}
