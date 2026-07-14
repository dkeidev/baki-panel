"use client";

import {
  Check,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Link2,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface Catalog {
  id: string;
  name: string;
  slug: string;
  productsCount: number;
  status: "active" | "draft";
}

export default function CatalogManager() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([
    {
      id: "1",
      name: "Colección de Invierno 2026",
      slug: "invierno-2026",
      productsCount: 8,
      status: "active",
    },
    {
      id: "2",
      name: "Accesorios y Calzado",
      slug: "accesorios",
      productsCount: 4,
      status: "draft",
    },
  ]);

  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newCatalog: Catalog = {
      id: Date.now().toString(),
      name,
      slug,
      productsCount: 0,
      status: "draft",
    };

    setCatalogs([newCatalog, ...catalogs]);
    setName("");
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCatalogs(catalogs.filter((c) => c.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setCatalogs(
      catalogs.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "draft" : "active" }
          : c,
      ),
    );
  };

  const handleCopyLink = (catalog: Catalog) => {
    const link = `${window.location.origin}/${catalog.slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(catalog.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface">
            Mis Catálogos
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Crea, edita y comparte tus catálogos interactivos de venta.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:opacity-90 transition-all text-on-primary font-bold px-5 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />{" "}
          {showForm ? "Cerrar Formulario" : "Nuevo Catálogo"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="glass-card p-6 rounded-2xl border border-outline/10 bg-surface-container/30 max-w-xl animate-in slide-in-from-top-4 duration-200"
        >
          <h3 className="text-lg font-bold mb-4 text-on-surface">
            Crear Nuevo Catálogo
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="catalog-name"
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2"
              >
                Nombre del Catálogo
              </label>
              <input
                id="catalog-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Ropa Casual Verano"
                className="w-full h-12 px-4 rounded-xl border border-outline/30 bg-background text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
                required
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-outline/25 font-bold text-sm text-on-surface hover:bg-on-surface/5 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-colors cursor-pointer"
              >
                Guardar Catálogo
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Stats Summary */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-outline/10 bg-surface-container/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Catálogos Activos
            </span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-black text-on-surface">
            {catalogs.filter((c) => c.status === "active").length} / 3
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            Plan Gratuito Emprendedor
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-outline/10 bg-surface-container/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Productos Totales
            </span>
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-black text-on-surface">
            {catalogs.reduce((acc, c) => acc + c.productsCount, 0)}
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            Subidos en tus catálogos
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-outline/10 bg-surface-container/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Vistas Totales
            </span>
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-black text-on-surface">148</div>
          <p className="text-xs text-on-surface-variant mt-2">
            Visitas de clientes reales
          </p>
        </div>
      </div>

      {/* Catalogs list */}
      {catalogs.length === 0 ? (
        <div className="glass-card rounded-[2rem] p-12 text-center border border-outline/10 bg-surface-container/10 flex flex-col items-center justify-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-on-surface">
            No tienes catálogos creados
          </h3>
          <p className="text-on-surface-variant text-sm max-w-sm mb-6">
            Haz clic en el botón superior para crear tu primer catálogo y
            empezar a recibir pedidos por WhatsApp.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className="glass-card p-6 rounded-2xl border border-outline/10 bg-surface-container/20 flex flex-col justify-between hover:bg-surface-container/30 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span
                    onClick={() => handleToggleStatus(catalog.id)}
                    className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider cursor-pointer select-none transition-colors ${
                      catalog.status === "active"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {catalog.status === "active" ? "Activo" : "Borrador"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(catalog)}
                      className="p-1.5 rounded-lg border border-outline/20 hover:bg-primary/10 hover:text-primary transition-colors text-on-surface-variant"
                      title="Copiar enlace del catálogo"
                    >
                      {copiedId === catalog.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(catalog.id)}
                      className="p-1.5 rounded-lg border border-outline/20 hover:bg-red-500/10 hover:text-red-500 transition-colors text-on-surface-variant"
                      title="Eliminar catálogo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2">
                  {catalog.name}
                </h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5" /> baki.lat/{catalog.slug}
                </p>
              </div>

              <div className="border-t border-outline/10 pt-4 mt-6 flex justify-between items-center">
                <span className="text-sm font-semibold text-on-surface-variant">
                  {catalog.productsCount} productos
                </span>
                <a
                  href={`/${catalog.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  Ver Catálogo <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
