"use client";

import {
  AlertCircle,
  Boxes,
  Check,
  Copy,
  DollarSign,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  FolderOpen,
  Globe,
  Loader2,
  MessageCircle,
  Package,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  addProduct,
  deleteProduct,
  editProduct,
  toggleProductVisibility,
  addCategory,
  deleteCategory,
} from "../actions";

interface Product {
  id: string;
  product_code: string;
  name: string;
  price: number;
  description: string;
  image_url: string | null;
  stock: number | null;
  is_active: boolean;
  category_id?: string | null;
}

interface Commerce {
  id: string;
  name: string;
  slug: string;
  currency: string;
  whatsapp_number: string;
  description?: string | null;
  cover_image_url?: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
  commerce: Commerce;
  planType: string;
}

export default function ProductsClient({
  initialProducts,
  initialCategories,
  commerce,
  planType,
}: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCategoryLoading(true);
    const res = await addCategory(commerce.id, newCategoryName, commerce.slug);
    if (res.error) {
      alert(res.error);
    } else {
      setNewCategoryName("");
      window.location.reload();
    }
    setCategoryLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría? Los productos asociados quedarán sin categoría.")) return;
    setCategoryLoading(true);
    const res = await deleteCategory(id, commerce.slug);
    if (res.error) {
      alert(res.error);
    } else {
      window.location.reload();
    }
    setCategoryLoading(false);
  };

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/@${commerce.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeProducts = products.filter((p) => p.is_active);
  const activeCount = activeProducts.length;
  const totalCount = products.length;

  const currencySymbol =
    commerce.currency === "PEN"
      ? "S/."
      : commerce.currency === "USD"
        ? "$"
        : commerce.currency === "COP"
          ? "COL$"
          : commerce.currency === "ARS"
            ? "AR$"
            : commerce.currency === "CLP"
              ? "CLP$"
              : "$";

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.image_url);
    setError("");
    setIsModalOpen(true);
  };

  const handleToggleVisibility = async (product: Product) => {
    const nextActive = !product.is_active;
    try {
      await toggleProductVisibility(product.id, commerce.slug, nextActive);
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, is_active: nextActive } : p,
        ),
      );
    } catch (err: any) {
      alert(err.message || "No se pudo cambiar la visibilidad.");
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(productId, commerce.slug);
        setProducts(products.filter((p) => p.id !== productId));
      } catch (err: any) {
        alert(err.message || "No se pudo eliminar el producto.");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      let res;
      if (editingProduct) {
        res = await editProduct(
          editingProduct.id,
          commerce.slug,
          null,
          formData,
        );
      } else {
        res = await addProduct(commerce.id, null, formData);
      }

      if (res?.error) {
        setError(res.error);
      } else {
        setIsModalOpen(false);
        // Refresh local data to show new codes and images
        window.location.reload();
      }
    } catch (_err: any) {
      setError("Ocurrió un error inesperado al procesar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 flex-1 flex flex-col">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" /> Productos de{" "}
            {commerce.name}
          </h1>
          <p className="text-xs text-on-surface-variant">
            Administra los artículos de tu catálogo y controla su visibilidad
            online.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {planType !== "free" && (
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-sm font-bold border border-outline/15 hover:bg-surface-container text-on-surface transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FolderOpen className="w-4 h-4 text-primary" />
              <span>Categorías</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-primary hover:opacity-95 text-on-primary font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Producto</span>
          </button>
        </div>
      </div>

      {/* Banner de configuración incompleta */}
      {(!commerce.description || !commerce.cover_image_url) && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4.5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-xl text-amber-500 flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-on-surface">
                Personaliza tu catálogo para vender más
              </h3>
              <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
                A tu tienda aún le falta:{" "}
                <span className="font-semibold text-amber-500">
                  {[
                    !commerce.cover_image_url && "foto de portada",
                    !commerce.description && "descripción de tu negocio",
                  ]
                    .filter(Boolean)
                    .join(" y ")}
                </span>
                . Un perfil completo genera mayor confianza y ayuda a tus clientes a comprar más rápido.
              </p>
            </div>
          </div>
          <a
            href={`/panel/${commerce.slug}/store`}
            className="w-full md:w-auto bg-amber-500 text-black hover:bg-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
          >
            <span>Completar Perfil</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Share Store Banner */}
      <div className="bg-primary/5 border border-primary/20 p-4.5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" /> Enlace de tu Catálogo
          </div>
          <div className="text-sm font-black text-on-surface">
            baki.lat/@{commerce.slug}
          </div>
          <p className="text-[10px] text-on-surface-variant">
            Comparte esta dirección con tus clientes por redes sociales o
            añádela a tu biografía.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* View Catalog */}
          <a
            href={`/@${commerce.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none bg-surface-container hover:bg-outline/5 border border-outline/10 text-on-surface px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Tienda</span>
          </a>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`flex-1 md:flex-none border px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              copied
                ? "bg-green-500/10 border-green-500/20 text-green-500"
                : "bg-surface-container hover:bg-outline/5 border-outline/10 text-on-surface"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Enlace</span>
              </>
            )}
          </button>

          {/* Share on WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Hola! Te invito a ver mi catálogo de productos en Baki: https://baki.lat/@${commerce.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.101-2.885-6.963C16.58 1.952 14.11 .928 11.48.928c-5.44 0-9.866 4.421-9.869 9.865-.001 1.77.463 3.5 1.34 5.025l-.949 3.468 3.556-.932zm13.102-5.705c-.329-.165-1.947-.961-2.245-1.07-.298-.109-.516-.164-.732.164-.216.329-.838 1.07-1.026 1.287-.188.217-.376.244-.705.08-3.033-1.517-4.148-2.224-5.836-5.114-.26-.445.26-.413.743-1.378.1-.2.05-.376-.025-.541-.075-.165-.732-1.764-1.002-2.414-.262-.63-.53-.544-.732-.555-.187-.01-.403-.012-.619-.012-.216 0-.569.081-.866.406-.297.329-1.135 1.109-1.135 2.703 0 1.594 1.16 3.134 1.321 3.352.162.217 2.28 3.483 5.525 4.881.772.333 1.374.531 1.843.68.777.247 1.485.212 2.046.128.625-.094 1.947-.796 2.221-1.564.275-.768.275-1.428.193-1.564-.083-.136-.302-.218-.63-.383z"/>
            </svg>
            <span>Compartir</span>
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card/40 border border-outline/10 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-on-surface-variant">
              Productos Activos
            </span>
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-black">{activeCount}</span>
            <span className="text-xs text-on-surface-variant">
              / 20 visibles
            </span>
          </div>
          <div className="mt-3 w-full bg-outline/5 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((activeCount / 20) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-card/40 border border-outline/10 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-on-surface-variant">
              Capacidad de Catálogo
            </span>
            <Boxes className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-black">{totalCount}</span>
            <span className="text-xs text-on-surface-variant">
              / 100 creados
            </span>
          </div>
          <div className="mt-3 w-full bg-outline/5 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalCount / 100) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-card/40 border border-outline/10 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-on-surface-variant">
              Moneda Comercial
            </span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-black">{commerce.currency}</span>
            <span className="text-xs text-on-surface-variant">
              ({currencySymbol})
            </span>
          </div>
          <p className="mt-2 text-[10px] text-on-surface-variant">
            Configurable en la pestaña "Mi Tienda".
          </p>
        </div>
      </div>

      {/* Main product display */}
      {totalCount === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 border border-dashed border-outline/10 rounded-2xl bg-card/10 backdrop-blur-sm">
          <Package className="w-16 h-16 text-on-surface-variant/20 mb-4" />
          <h3 className="text-lg font-bold text-on-surface">
            No hay productos creados
          </h3>
          <p className="text-xs text-on-surface-variant text-center max-w-sm mt-1 mb-6">
            Aún no has agregado productos a tu tienda. Agrégalos ahora para que
            tus clientes puedan verlos en tu enlace público.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-primary hover:opacity-95 text-on-primary font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
          >
            <Plus className="w-4 h-4" />
            <span>Crear primer producto</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Categorías (Pills de Filtrado) */}
          {planType !== "free" && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedCategory === "all"
                    ? "bg-primary border-primary text-on-primary shadow-md"
                    : "bg-surface-container border-outline/10 text-on-surface hover:bg-outline/5"
                } cursor-pointer`}
              >
                Todos ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedCategory === cat.id
                        ? "bg-primary border-primary text-on-primary shadow-md"
                        : "bg-surface-container border-outline/10 text-on-surface hover:bg-outline/5"
                    } cursor-pointer`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products
              .filter((product) => selectedCategory === "all" || product.category_id === selectedCategory)
              .map((product) => (
            <div
              key={product.id}
              className={`bg-card/35 border rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between ${
                product.is_active
                  ? "border-outline/10 shadow-md"
                  : "border-outline/5 opacity-70"
              }`}
            >
              {/* Product Cover image */}
              <div className="relative aspect-video w-full bg-surface-container-high/60 flex items-center justify-center overflow-hidden border-b border-outline/5">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-8 h-8 text-on-surface-variant/20" />
                )}
                {/* Code Badge */}
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-primary border border-outline/10">
                  {product.product_code || "REF-XXXX"}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm text-on-surface line-clamp-1">
                      {product.name}
                    </h3>
                    <span className="font-mono text-sm font-black text-primary whitespace-nowrap">
                      {currencySymbol} {Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 h-8">
                    {product.description || "Sin descripción."}
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-on-surface-variant">
                      Stock:{" "}
                      <span className="font-bold text-on-surface">
                        {product.stock !== null ? product.stock : "Ilimitado"}
                      </span>
                    </span>
                    {/* Visibility Trigger Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(product)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                        product.is_active
                          ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"
                          : "bg-on-surface-variant/5 border-outline/10 text-on-surface-variant hover:bg-on-surface-variant/10"
                      }`}
                    >
                      {product.is_active ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Oculto</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 pt-2 border-t border-outline/5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(product)}
                      className="flex-1 bg-surface-container hover:bg-outline/5 border border-outline/10 hover:border-primary/20 text-on-surface hover:text-primary py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-card border border-outline/10 p-6 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-outline/5 pb-3">
              <h2 className="text-lg font-black text-on-surface">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="hidden"
                name="currentImageUrl"
                value={editingProduct?.image_url || ""}
              />

              {/* Name */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-xs font-bold text-on-surface"
                >
                  Nombre del Producto
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="ej: Tarta de Fresa Especial"
                  defaultValue={editingProduct?.name || ""}
                  className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-1">
                  <label
                    htmlFor="price"
                    className="text-xs font-bold text-on-surface"
                  >
                    Precio ({currencySymbol})
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="15.00"
                    defaultValue={editingProduct?.price || ""}
                    className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label
                    htmlFor="stock"
                    className="text-xs font-bold text-on-surface"
                  >
                    Stock (Opcional)
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="Ilimitado"
                    defaultValue={editingProduct?.stock ?? ""}
                    className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1">
                <label
                  htmlFor="categoryId"
                  className="text-xs font-bold text-on-surface flex justify-between items-center"
                >
                  <span>Categoría</span>
                  {planType === "free" && (
                    <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-0.5">
                      🔒 Plan Lite+
                    </span>
                  )}
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  disabled={planType === "free"}
                  defaultValue={editingProduct?.category_id || ""}
                  className={`w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors ${
                    planType === "free" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Sin Categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label
                  htmlFor="description"
                  className="text-xs font-bold text-on-surface"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Describe los ingredientes, tamaño o detalles..."
                  defaultValue={editingProduct?.description || ""}
                  className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface">
                  Imagen del Producto
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* File selector input */}
                  <label className="border border-dashed border-outline/20 hover:border-primary/40 bg-surface-container/30 hover:bg-surface-container/50 px-4 py-6 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center">
                    <Upload className="w-6 h-6 text-primary" />
                    <span className="text-xs font-bold text-on-surface">
                      Subir Foto
                    </span>
                    <span className="text-[9px] text-on-surface-variant">
                      Formatos: PNG, JPG, WEBP. Máx 5MB
                    </span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Image Preview box */}
                  <div className="aspect-video w-full rounded-xl bg-surface-container-high/40 border border-outline/10 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-on-surface-variant">
                        Sin vista previa
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-outline/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-surface-container hover:bg-outline/5 border border-outline/10 text-on-surface py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:opacity-95 text-on-primary py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Producto</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Category Manager Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCategoryModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-outline/10 p-6 rounded-2xl shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-outline/5 pb-3">
              <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary" /> Categorías de la Tienda
              </h2>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Create Category Form */}
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="ej: Bebidas, Postres"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={categoryLoading}
                className="flex-1 bg-surface-container text-on-surface text-sm px-4 py-2 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={categoryLoading}
                className="bg-primary hover:opacity-95 text-on-primary font-bold px-4 py-2 rounded-xl text-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {categoryLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Crear</span>
                  </>
                )}
              </button>
            </form>

            {/* Categories List */}
            <div className="space-y-2 pt-2 border-t border-outline/5">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
                Categorías Creadas
              </span>
              {categories.length === 0 ? (
                <div className="text-xs text-on-surface-variant text-center py-4">
                  No has creado ninguna categoría aún.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[40vh] overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 bg-surface-container/50 border border-outline/5 rounded-xl"
                    >
                      <span className="text-sm font-semibold text-on-surface">{cat.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={categoryLoading}
                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-outline/5">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-full bg-surface-container hover:bg-outline/5 border border-outline/10 text-on-surface py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-center"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
