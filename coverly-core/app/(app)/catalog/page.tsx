"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Modal } from "@heroui/react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import {
  X,
  TableProperties,
  LayoutPanelTop,
  Car,
  Heart,
  Home,
  Smartphone,
  Package,
} from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onOpenChange = (open: boolean) => setIsOpen(open);

  const toggleCompare = (prod: Product) => {
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === prod.id);
      if (exists) return prev.filter((p) => p.id !== prod.id);
      if (prev.length >= 3) return prev;
      if (prev.length > 0 && prev[0].type !== prod.type) return prev;
      return [...prev, prod];
    });
  };

  const renderTypeIcon = (type: string, size = 20) => {
    switch (type) {
      case "AUTO":
        return <Car size={size} />;
      case "LIFE":
        return <Heart size={size} />;
      case "FIRE":
        return <Home size={size} />;
      case "MOBILE":
        return <Smartphone size={size} />;
      default:
        return <Package size={size} />;
    }
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
          products.reduce(
            (acc, p) => {
              acc[p.type] = acc[p.type] || [];
              acc[p.type].push(p);
              return acc;
            },
            {} as Record<string, Product[]>,
          ),
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
                    isCompared={compareList.some((p) => p.id === product.id)}
                    canCompare={
                      compareList.length < 3 &&
                      (compareList.length === 0 ||
                        compareList[0].type === product.type)
                    }
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {compareList.length > 0 && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 px-6 py-2.5 flex items-center justify-between gap-8 z-40 w-[95%] max-w-sm animate-fade-in-up">
          <div className="flex flex-col min-w-max">
            <span className="font-extrabold text-trust-blue text-sm leading-tight tracking-tight">
              {compareList.length}/3 seguros
            </span>
            <span className="text-[9px] uppercase font-bold text-insight-teal tracking-wider">
              Categoría: {compareList[0]?.type}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="p-1.5 hover:bg-red-50 text-slate hover:text-red-500 transition-all rounded-full"
              onClick={() => setCompareList([])}
              title="Limpiar comparación"
            >
              <X size={18} />
            </button>
            <Button
              size="sm"
              variant="primary"
              className="bg-trust-blue text-white font-bold rounded-full px-5 h-9 shadow-md flex items-center gap-2 hover:scale-[1.02] transition-transform"
              onPress={onOpen}
              isDisabled={compareList.length < 2}
            >
              <TableProperties size={16} />
              <span>Ver Tabla</span>
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Backdrop className="bg-black/50 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4">
          <Modal.Container className="w-full max-w-4xl mx-auto">
            <Modal.Dialog className="bg-white border focus:outline-none border-gray-100 shadow-2xl rounded-2xl overflow-hidden w-full relative flex flex-col">
              <Modal.Header className="flex flex-col gap-1 p-6 border-b border-gray-100 shrink-0">
                <Modal.Heading className="text-2xl font-bold text-trust-blue">
                  Comparador Técnico
                </Modal.Heading>
                <span className="text-sm font-medium text-slate uppercase tracking-widest">
                  Categoría: {compareList[0]?.type}
                </span>
              </Modal.Header>
              <Modal.Body className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="overflow-x-auto pb-4">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr>
                        <th className="text-left text-xs text-slate uppercase tracking-wider p-3 bg-soft-light border-b border-gray-200 w-48 font-bold">
                          Característica
                        </th>
                        {compareList.map((p) => (
                          <th
                            key={p.id}
                            className="text-center text-sm font-bold text-trust-blue p-3 bg-soft-light border-b border-gray-200"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-insight-teal opacity-80">
                                {renderTypeIcon(p.type)}
                              </span>
                              {p.name}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 italic">
                        <td className="text-xs font-semibold text-slate uppercase tracking-wider p-3">
                          Precio Base
                        </td>
                        {compareList.map((p) => (
                          <td
                            key={p.id}
                            className="text-center p-3 text-lg font-bold text-insight-teal"
                          >
                            ${Number(p.priceBase).toLocaleString("es-MX")}
                          </td>
                        ))}
                      </tr>
                      {(() => {
                        const allCoverageNames = Array.from(
                          new Set(
                            compareList.flatMap((p) =>
                              p.coverages.map((c) => c.name),
                            ),
                          ),
                        );
                        return allCoverageNames.map((covName) => (
                          <tr
                            key={covName}
                            className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                          >
                            <td className="text-[11px] font-medium text-slate p-3">
                              {covName}
                            </td>
                            {compareList.map((p) => {
                              const hasCov = p.coverages.find(
                                (c) => c.name === covName,
                              );
                              return (
                                <td
                                  key={p.id}
                                  className="text-center p-3 align-middle"
                                >
                                  {hasCov ? (
                                    <div className="flex flex-col items-center justify-center gap-1">
                                      <span className="text-insight-teal text-lg leading-none font-bold">
                                        ✓
                                      </span>
                                      {hasCov.value && (
                                        <span className="text-[10px] text-graphite font-semibold">
                                          $
                                          {Number(hasCov.value).toLocaleString(
                                            "es-MX",
                                          )}
                                        </span>
                                      )}
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
              </Modal.Body>
              <Modal.Footer className="flex justify-end p-6 border-t border-gray-100 shrink-0">
                <Button
                  variant="primary"
                  onPress={() => setIsOpen(false)}
                  className="bg-trust-blue text-white font-bold px-8 rounded-full"
                >
                  Entendido
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
