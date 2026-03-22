"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/ui/LoadingScreen";

const ProductCard = dynamic(() => import("@/components/ui/ProductCard"), {
  loading: () => (
    <div className="h-64 border border-gray-100 rounded-xl bg-gray-50 animate-pulse"></div>
  ),
  ssr: false,
});

interface Product {
  id: string;
  name: string;
  type: string;
  description: string;
  priceBase: number;
  coverages: { id: string; name: string; value: number | null }[];
}

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen message="Cargando catálogo de seguros..." />;
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-trust-blue mb-2">
          Catálogo de Seguros
        </h1>
        <p className="text-slate">
          Planes y coberturas disponibles para ofertar.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
