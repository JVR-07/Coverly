"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Chip,
} from "@nextui-org/react";

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
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
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
          <Card
            key={product.id}
            className="bg-white border border-gray-100 shadow-md hover:shadow-lg transition-shadow overflow-visible"
          >
            <CardHeader className="flex gap-3 px-6 pt-6 pb-2">
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start w-full">
                  <p className="text-xl font-bold text-trust-blue">
                    {product.name}
                  </p>
                  <Chip
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="tracking-widest capitalize bg-trust-blue/10 text-trust-blue"
                  >
                    {product.type}
                  </Chip>
                </div>
                <p className="text-sm text-slate mt-2 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </CardHeader>
            <Divider className="bg-gray-100 my-2" />
            <CardBody className="px-6 py-4">
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
            <CardFooter className="px-6 py-4 flex justify-between items-center bg-soft-light/50">
              <span className="text-xs font-medium text-slate uppercase tracking-widest">
                Precio base desde
              </span>
              <p className="font-bold text-xl text-trust-blue">
                ${Number(product.priceBase).toLocaleString("es-MX")}{" "}
                <span className="text-sm font-normal text-slate">MXN</span>
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
