"use client";

import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
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
  canCompare = true
}: { 
  product: Product;
  onCompare?: () => void;
  isCompared?: boolean;
  canCompare?: boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Card className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg hover:border-trust-blue transition-all overflow-hidden flex flex-col h-full">
        <CardHeader className="flex gap-3 px-6 pt-6 pb-2">
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-start w-full gap-2">
              <p className="text-xl font-bold text-trust-blue">{product.name}</p>
              <div className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-trust-blue text-white shrink-0 shadow-sm">
                {product.type}
              </div>
            </div>
            <p className="text-sm text-slate mt-2 line-clamp-2">
              {product.description}
            </p>
          </div>
        </CardHeader>
        <Divider className="bg-gray-100 my-2" />
        <CardBody className="px-6 py-4 flex-grow">
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
        </CardBody>
        <Divider className="bg-gray-100" />
        <CardFooter className="px-6 py-4 flex flex-col gap-4 bg-soft-light/50">
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
              color="primary"
              variant="flat"
              size="lg"
              className="w-full font-bold bg-trust-blue/5 text-trust-blue hover:bg-trust-blue hover:text-white transition-all border border-trust-blue/10 h-12 flex items-center justify-center gap-2"
              radius="full"
              onPress={onOpen}
            >
              <Info size={18} className="shrink-0" />
              <span>Ver Detalle Completo</span>
            </Button>
            {onCompare && (
              <Button
                color={isCompared ? "primary" : "default"}
                variant={isCompared ? "solid" : "bordered"}
                size="lg"
                className={`w-full font-bold transition-all shadow-sm h-12 flex items-center justify-center gap-2 ${
                  isCompared 
                    ? 'bg-insight-teal text-white border-insight-teal' 
                    : !canCompare 
                      ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-70'
                      : 'text-slate border-gray-200 hover:border-trust-blue hover:text-trust-blue bg-white'
                }`}
                radius="full"
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
                <span>{isCompared ? "En Comparación" : !canCompare ? "Categoría distinta" : "Comparar Seguro"}</span>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-trust-blue">{product.name}</h2>
                <span className="text-sm font-medium text-slate uppercase tracking-widest">Categoría: {product.type}</span>
              </ModalHeader>
              <ModalBody>
                <p className="text-graphite mb-4 leading-relaxed">
                  {product.description}
                </p>
                <div className="bg-soft-light p-4 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-bold text-trust-blue uppercase tracking-widest mb-4">
                    Todas las Coberturas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.coverages.map((cov) => (
                      <div key={cov.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <span className="text-sm font-medium text-graphite flex items-center gap-2">
                           <span className="text-insight-teal shrink-0">✓</span> {cov.name}
                        </span>
                        {cov.value !== null && (
                          <span className="text-xs font-bold text-trust-blue bg-trust-blue/10 px-2 py-1 rounded-md">
                            ${Number(cov.value).toLocaleString("es-MX")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-between items-center border-t border-gray-100 mt-4">
                <p className="font-bold text-2xl text-trust-blue">
                  ${Number(product.priceBase).toLocaleString("es-MX")}{" "}
                  <span className="text-sm font-normal text-slate">MXN</span>
                </p>
                <Button color="primary" onPress={onClose} className="bg-trust-blue font-bold">
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
