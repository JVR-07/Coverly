"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
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
  const [compareList, setCompareList] = useState<Product[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const toggleCompare = (prod: Product) => {
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === prod.id);
      if (exists) return prev.filter((p) => p.id !== prod.id);
      if (prev.length >= 3) return prev;
      if (prev.length > 0 && prev[0].type !== prod.type) return prev;
      return [...prev, prod];
    });
  };

  const typeIconMap: Record<string, string> = {
    AUTO: "🚗",
    LIFE: "❤️",
    FIRE: "🏠",
    MOBILE: "📱",
  };

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
    <div className="space-y-6 pb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-trust-blue mb-2">
          Catálogo de Seguros
        </h1>
        <p className="text-slate">
          Planes y coberturas disponibles para ofertar.
        </p>
      </header>

      <div className="space-y-12">
        {Object.entries(
          products.reduce((acc, p) => {
            acc[p.type] = acc[p.type] || [];
            acc[p.type].push(p);
            return acc;
          }, {} as Record<string, Product[]>)
        ).map(([type, typeProducts]) => {
          const typeLabels: Record<string, string> = {
            AUTO: "Seguros de Automóvil",
            LIFE: "Seguros de Vida",
            FIRE: "Protección de Hogar",
            MOBILE: "Seguros de Equipo Móvil",
          };

          return (
            <section key={type}>
              <h2 className="text-2xl font-bold text-slate mb-6 border-b border-gray-100 pb-2">
                {typeLabels[type] || type}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {typeProducts.map((product) => (
                  <ProductCard 
                     key={product.id} 
                     product={product} 
                     onCompare={() => toggleCompare(product)}
                     isCompared={compareList.some(p => p.id === product.id)}
                     canCompare={compareList.length < 3 && (compareList.length === 0 || compareList[0].type === product.type)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {compareList.length > 0 && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 pl-6 pr-3 py-3 flex items-center gap-6 z-40 w-[95%] max-w-md justify-between animate-fade-in-up">
          <div className="flex flex-col">
            <span className="font-bold text-trust-blue text-sm">{compareList.length}/3 seguros</span>
            <span className="text-[10px] uppercase font-semibold text-insight-teal">Misma categoría req.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="light" color="danger" radius="full" className="px-2" onPress={() => setCompareList([])}>X</Button>
            <Button size="sm" color="primary" radius="full" className="bg-trust-blue text-white font-bold" onPress={onOpen} isDisabled={compareList.length < 2}>
              Ver Tabla
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-trust-blue">Comparador Técnico</h2>
                <span className="text-sm font-medium text-slate uppercase tracking-widest">Categoría: {compareList[0]?.type}</span>
              </ModalHeader>
              <ModalBody>
                <div className="overflow-x-auto pb-4">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr>
                        <th className="text-left text-xs text-slate uppercase tracking-wider p-3 bg-soft-light border-b border-gray-200 w-48">Característica</th>
                        {compareList.map((p) => (
                          <th key={p.id} className="text-center text-sm font-bold text-trust-blue p-3 bg-soft-light border-b border-gray-200">
                            <span className="text-xl mr-1">{typeIconMap[p.type] || "📦"}</span>
                            {p.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="text-xs font-semibold text-slate uppercase tracking-wider p-3">Precio Base</td>
                        {compareList.map((p) => (
                          <td key={p.id} className="text-center p-3 text-lg font-bold text-insight-teal">
                            ${Number(p.priceBase).toLocaleString("es-MX")}
                          </td>
                        ))}
                      </tr>
                      {/* Recopilar todas las coberturas únicas */}
                      {(() => {
                        const allCoverageNames = Array.from(new Set(compareList.flatMap(p => p.coverages.map(c => c.name))));
                        return allCoverageNames.map(covName => (
                          <tr key={covName} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="text-[11px] font-medium text-slate p-3">{covName}</td>
                            {compareList.map(p => {
                              const hasCov = p.coverages.find(c => c.name === covName);
                              return (
                                <td key={p.id} className="text-center p-3 align-middle">
                                  {hasCov ? (
                                    <div className="flex flex-col items-center justify-center gap-1">
                                      <span className="text-insight-teal text-lg leading-none">✓</span>
                                      {hasCov.value && <span className="text-[10px] text-graphite font-semibold">${Number(hasCov.value).toLocaleString("es-MX")}</span>}
                                    </div>
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="bg-trust-blue font-bold" radius="full">Entendido</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}
