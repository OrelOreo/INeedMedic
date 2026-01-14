"use client";
import { Suspense } from "react";
import SearchForm from "./search-form";

export default function SearchFormWrapper() {
  return (
    <Suspense fallback={null}>
      <SearchForm />
    </Suspense>
  );
}
