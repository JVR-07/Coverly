"use client";

import { Card, Separator, Modal, Button } from "@heroui/react";
import { useState } from "react";
import { Info, BarChart2, CheckCircle2, Lock } from "lucide-react";

interface Product {
  id: string;
  name: string;
  type: string;
  description: string;
  priceBase: number;
  coverages: { id: string; name: string; value: number | null }[];
}

export default function ProductCard({
  product,
  onCompare,
  isCompared = false,
  canCompare = true,
}: {
  product: Product;
  onCompare?: () => void;
  isCompared?: boolean;
  canCompare?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onOpenChange = (open: boolean) => setIsOpen(open);

  return (
    <>
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg hover:border-trust-blue transition-all overflow-hidden flex flex-col h-full">
        <Card.Header className="flex gap-3 px-6 pt-6 pb-2">
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-start w-full gap-2">
              <Card.Title className="text-xl font-bold text-trust-blue">
                {product.name}
              </Card.Title>
              <div className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-trust-blue text-white shrink-0 shadow-sm">
                {product.type}
              </div>
            </div>
            <Card.Description className="text-sm text-slate mt-2 line-clamp-2">
              {product.description}
            </Card.Description>
          </div>
        </Card.Header>
        <Separator className="bg-gray-100 my-2" />
        <Card.Content className="px-6 py-4 flex-grow">
          <h4 className="text-xs font-semibold text-slate uppercase tracking-wider mb-3">
            Coberturas Incluidas
          </h4>
          <ul className="space-y-2">
            {product.coverages.slice(0, 3).map((cov) => (
              <li
                key={cov.id}
                className="flex items-center gap-2 text-sm text-graphite group"
              >
                <span className="text-insight-teal shrink-0 group-hover:scale-110 transition-transform">
                  ✓
                </span>
                {cov.name}
              </li>
            ))}
            {product.coverages.length > 3 && (
              <li className="text-xs text-slate italic mt-2">
                + {product.coverages.length - 3} coberturas más
              </li>
            )}
          </ul>
        </Card.Content>
        <Separator className="bg-gray-100" />
        <Card.Footer className="px-6 py-4 flex flex-col gap-4 bg-soft-light/50">
          <div className="flex justify-between items-center w-full">
            <span className="text-xs font-medium text-slate uppercase tracking-widest">
              Precio base desde
            </span>
            <p className="font-bold text-xl text-trust-blue">
              ${Number(product.priceBase).toLocaleString("es-MX")}{" "}
              <span className="text-sm font-normal text-slate">MXN</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full mt-2">
            <Button
              variant="outline"
              className="w-full font-bold bg-trust-blue/5 text-trust-blue hover:bg-trust-blue hover:text-white transition-all border border-trust-blue/10 h-12 flex items-center justify-center gap-2 rounded-full"
              onPress={onOpen}
            >
              <Info size={18} className="shrink-0" />
              <span>Ver Detalle Completo</span>
            </Button>
            {onCompare && (
              <Button
                variant={isCompared ? "primary" : "outline"}
                className={`w-full font-bold transition-all shadow-sm h-12 flex items-center justify-center gap-2 rounded-full ${
                  isCompared
                    ? "bg-insight-teal text-white border-insight-teal"
                    : !canCompare
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-70"
                      : "text-slate border-gray-200 hover:border-trust-blue hover:text-trust-blue bg-white"
                }`}
                isDisabled={!canCompare && !isCompared}
                onPress={onCompare}
              >
                {isCompared ? (
                  <CheckCircle2 size={18} className="shrink-0" />
                ) : !canCompare ? (
                  <Lock size={16} className="shrink-0 opacity-50" />
                ) : (
                  <BarChart2 size={18} className="shrink-0" />
                )}
                <span>
                  {isCompared
                    ? "En Comparación"
                    : !canCompare
                      ? "Categoría distinta"
                      : "Comparar Seguro"}
                </span>
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Backdrop className="bg-black/50 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4">
          <Modal.Container className="w-full max-w-2xl">
            <Modal.Dialog className="bg-white border focus:outline-none border-gray-100 shadow-2xl rounded-2xl overflow-hidden w-full mx-auto relative flex flex-col">
              <Modal.Header className="flex flex-col gap-1 p-6 border-b border-gray-100 shrink-0">
                <Modal.Heading className="text-2xl font-bold text-trust-blue">
                  {product.name}
                </Modal.Heading>
                <span className="text-sm font-medium text-slate uppercase tracking-widest">
                  Categoría: {product.type}
                </span>
              </Modal.Header>
              <Modal.Body className="p-6 overflow-y-auto max-h-[60vh]">
                <p className="text-graphite mb-4 leading-relaxed">
                  {product.description}
                </p>
                <div className="bg-soft-light p-4 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-bold text-trust-blue uppercase tracking-widest mb-4">
                    Todas las Coberturas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.coverages.map((cov) => (
                      <div
                        key={cov.id}
                        className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                      >
                        <span className="text-sm font-medium text-graphite flex items-center gap-2">
                          <span className="text-insight-teal shrink-0">✓</span>{" "}
                          {cov.name}
                        </span>
                        {cov.value !== null ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold text-slate uppercase tracking-wider mb-0.5">
                              Suma Asegurada
                            </span>
                            <span className="text-xs font-extrabold text-trust-blue bg-trust-blue/5 px-2 py-0.5 rounded border border-trust-blue/10">
                              ${Number(cov.value).toLocaleString("es-MX")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded uppercase tracking-wider">
                            Incluido
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="flex justify-between items-center p-6 border-t border-gray-100 shrink-0 bg-soft-light/30">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate uppercase tracking-[0.2em] mb-1">
                    Costo Base
                  </span>
                  <p className="font-extrabold text-3xl text-trust-blue leading-none">
                    ${Number(product.priceBase).toLocaleString("es-MX")}{" "}
                    <span className="text-sm font-medium text-slate opacity-60">
                      MXN
                    </span>
                  </p>
                </div>
                <Button
                  variant="primary"
                  onPress={() => setIsOpen(false)}
                  className="bg-trust-blue text-white font-bold px-10 h-12 rounded-full shadow-lg hover:shadow-trust-blue/20 hover:scale-[1.02] transition-all"
                >
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
