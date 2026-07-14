"use client";

import { useState } from "react";
import {
  Calendar,
  Check,
  CreditCard,
  Eye,
  FileText,
  MapPin,
  Search,
  ShoppingCart,
  Truck,
  Upload,
  User,
  X,
  ExternalLink,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { updateOrderStatus, uploadPaymentProofAction, createManualOrder } from "../actions";

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price_at_purchase: number;
  products: {
    id: string;
    name: string;
    image_url: string | null;
  } | null;
}

interface Order {
  id: string;
  commerce_id: string;
  customer_name: string;
  customer_whatsapp: string;
  customer_address: string | null;
  total_amount: number;
  currency: string;
  status: string; // 'pending', 'paid', 'shipped', 'cancelled'
  payment_method: string; // 'yape', 'contraentrega'
  payment_transaction_id: string | null;
  payment_proof_url: string | null;
  payment_verified_at: string | null;
  created_at: string;
  order_items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number | null;
}

interface OrdersClientProps {
  initialOrders: any[];
  commerce: {
    id: string;
    slug: string;
    name: string;
  };
  products: Product[];
}

export default function OrdersClient({ initialOrders, commerce, products }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Manual Order Modal States
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [addOrderError, setAddOrderError] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_whatsapp.includes(searchQuery) ||
      order.id.slice(0, 5).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatus(orderId, newStatus, commerce.slug);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } else {
      alert(res.error || "Error al actualizar estado");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUploadError(null);
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    const res = await uploadPaymentProofAction(selectedOrder.id, commerce.slug, null, formData);

    setIsUploading(false);

    if (res.success) {
      // We can update locally
      const mockProofUrl = URL.createObjectURL(formData.get("payment_proof") as File);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, status: "paid", payment_proof_url: mockProofUrl }
            : o
        )
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: "paid", payment_proof_url: mockProofUrl } : null
      );
      // Recargar la página en NextJS de fondo
      window.location.reload();
    } else {
      setUploadError(res.error || "Ocurrió un error al subir.");
    }
  };

  const handleAddOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddOrderError("");
    setIsSubmittingOrder(true);

    const formData = new FormData(e.currentTarget);
    const customerName = (formData.get("customerName") as string)?.trim();
    const customerWhatsapp = (formData.get("customerWhatsapp") as string)?.trim();
    const customerAddress = (formData.get("customerAddress") as string)?.trim();
    const paymentMethod = formData.get("paymentMethod") as string;
    const productId = formData.get("productId") as string;
    const quantity = parseInt(formData.get("quantity") as string, 10);

    if (!customerName || !customerWhatsapp || !productId || isNaN(quantity) || quantity <= 0) {
      setAddOrderError("Por favor completa todos los campos obligatorios.");
      setIsSubmittingOrder(false);
      return;
    }

    const res = await createManualOrder(
      commerce.id,
      commerce.slug,
      customerName,
      customerWhatsapp,
      customerAddress,
      paymentMethod,
      productId,
      quantity
    );

    if (res.error) {
      setAddOrderError(res.error);
    } else {
      setIsAddOrderOpen(false);
      window.location.reload();
    }
    setIsSubmittingOrder(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Pendiente
          </span>
        );
      case "paid":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Pagado
          </span>
        );
      case "shipped":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            Enviado
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">Gestión de Pedidos</h1>
          <p className="text-sm text-on-surface-variant">
            Administra los pedidos entrantes del bot de WhatsApp para *{commerce.name}*.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOrderOpen(true)}
          className="bg-primary hover:opacity-95 text-on-primary font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Pedido</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por cliente, WhatsApp o código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container/30 border border-outline/10 focus:border-primary/50 focus:outline-none rounded-xl transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "paid", "shipped", "cancelled"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                statusFilter === filter
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-surface-container/20 border-outline/5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {filter === "all" && "Todos"}
              {filter === "pending" && "Pendientes"}
              {filter === "paid" && "Pagados"}
              {filter === "shipped" && "Enviados"}
              {filter === "cancelled" && "Cancelados"}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid / Table */}
      {filteredOrders.length === 0 ? (
        <div className="flex-1 min-h-[300px] border border-outline/10 rounded-2xl flex flex-col items-center justify-center p-8 bg-surface-container/5 text-center">
          <ShoppingCart className="w-12 h-12 text-outline/30 mb-3" />
          <h3 className="text-base font-bold text-on-surface">No se encontraron pedidos</h3>
          <p className="text-xs text-on-surface-variant max-w-xs mt-1">
            Los pedidos realizados por los clientes se reflejarán aquí de forma automática.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-outline/10 rounded-2xl bg-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline/10 text-xs font-bold text-on-surface-variant bg-surface-container/20">
                <th className="p-4">Pedido</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Método de Pago</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-outline/5 hover:bg-surface-container/10 transition-colors text-sm"
                >
                  <td className="p-4 font-bold text-primary">
                    #{order.id.slice(0, 5).toUpperCase()}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-on-surface">{order.customer_name}</div>
                    <a
                      href={`https://wa.me/${order.customer_whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-500 hover:underline flex items-center gap-1.5 mt-0.5"
                    >
                      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.101-2.885-6.963C16.58 1.952 14.11 .928 11.48.928c-5.44 0-9.866 4.421-9.869 9.865-.001 1.77.463 3.5 1.34 5.025l-.949 3.468 3.556-.932zm13.102-5.705c-.329-.165-1.947-.961-2.245-1.07-.298-.109-.516-.164-.732.164-.216.329-.838 1.07-1.026 1.287-.188.217-.376.244-.705.08-3.033-1.517-4.148-2.224-5.836-5.114-.26-.445.26-.413.743-1.378.1-.2.05-.376-.025-.541-.075-.165-.732-1.764-1.002-2.414-.262-.63-.53-.544-.732-.555-.187-.01-.403-.012-.619-.012-.216 0-.569.081-.866.406-.297.329-1.135 1.109-1.135 2.703 0 1.594 1.16 3.134 1.321 3.352.162.217 2.28 3.483 5.525 4.881.772.333 1.374.531 1.843.68.777.247 1.485.212 2.046.128.625-.094 1.947-.796 2.221-1.564.275-.768.275-1.428.193-1.564-.083-.136-.302-.218-.63-.383z"/>
                      </svg>
                      <span>+{order.customer_whatsapp}</span>
                    </a>
                  </td>
                  <td className="p-4 text-on-surface-variant">
                    {new Date(order.created_at).toLocaleDateString("es-PE")}
                  </td>
                  <td className="p-4 capitalize text-on-surface">
                    {order.payment_method === "yape" ? "Yape / Plin" : "Contraentrega"}
                  </td>
                  <td className="p-4 font-mono font-bold text-on-surface">
                    S/. {Number(order.total_amount).toFixed(2)}
                  </td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 bg-surface-container hover:bg-outline/5 border border-outline/10 text-on-surface text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Order Creation Modal */}
      {isAddOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAddOrderOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-card border border-outline/10 p-6 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-outline/5 pb-3">
              <h2 className="text-lg font-black text-on-surface">Registrar Pedido Manual</h2>
              <button
                type="button"
                onClick={() => setIsAddOrderOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addOrderError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{addOrderError}</span>
              </div>
            )}

            <form onSubmit={handleAddOrderSubmit} className="space-y-4">
              {/* Customer Name */}
              <div className="space-y-1">
                <label htmlFor="customerName" className="text-xs font-bold text-on-surface">
                  Nombre del Cliente *
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  required
                  placeholder="ej: Juan Pérez"
                  className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer WhatsApp */}
                <div className="space-y-1">
                  <label htmlFor="customerWhatsapp" className="text-xs font-bold text-on-surface">
                    WhatsApp del Cliente * (sin +)
                  </label>
                  <input
                    id="customerWhatsapp"
                    name="customerWhatsapp"
                    type="text"
                    required
                    placeholder="ej: 51999888777"
                    className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-1">
                  <label htmlFor="paymentMethod" className="text-xs font-bold text-on-surface">
                    Método de Pago *
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    required
                    className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="yape">Yape / Plin</option>
                    <option value="contraentrega">Pago Contraentrega</option>
                  </select>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <label htmlFor="customerAddress" className="text-xs font-bold text-on-surface">
                  Dirección de Entrega (Opcional)
                </label>
                <input
                  id="customerAddress"
                  name="customerAddress"
                  type="text"
                  placeholder="ej: Av. Larco 123, Miraflores"
                  className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Product and Quantity */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label htmlFor="productId" className="text-xs font-bold text-on-surface">
                    Producto *
                  </label>
                  <select
                    id="productId"
                    name="productId"
                    required
                    className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Selecciona un producto...</option>
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} (S/. {Number(prod.price).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="quantity" className="text-xs font-bold text-on-surface">
                    Cantidad *
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    required
                    defaultValue="1"
                    className="w-full bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl border border-outline/10 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-outline/5">
                <button
                  type="button"
                  onClick={() => setIsAddOrderOpen(false)}
                  className="flex-1 bg-surface-container hover:bg-outline/5 border border-outline/10 text-on-surface py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="flex-1 bg-primary hover:opacity-95 text-on-primary py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <span>Registrar Pedido</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-3xl bg-card border border-outline/10 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-outline/10 flex justify-between items-center bg-surface-container/10">
              <div>
                <h2 className="text-lg font-black text-on-surface">
                  Detalle del Pedido #{selectedOrder.id.slice(0, 5).toUpperCase()}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedOrder.status)}
                  <span className="text-xs text-on-surface-variant">
                    {new Date(selectedOrder.created_at).toLocaleString("es-PE")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Customer Details */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" /> Datos del Cliente
                  </h4>
                  <div className="p-4 bg-surface-container/30 border border-outline/5 rounded-xl space-y-2">
                    <div>
                      <span className="text-xs text-on-surface-variant block">Nombre</span>
                      <span className="font-bold text-on-surface">{selectedOrder.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant block">WhatsApp</span>
                      <a
                        href={`https://wa.me/${selectedOrder.customer_whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-500 hover:underline flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.101-2.885-6.963C16.58 1.952 14.11 .928 11.48.928c-5.44 0-9.866 4.421-9.869 9.865-.001 1.77.463 3.5 1.34 5.025l-.949 3.468 3.556-.932zm13.102-5.705c-.329-.165-1.947-.961-2.245-1.07-.298-.109-.516-.164-.732.164-.216.329-.838 1.07-1.026 1.287-.188.217-.376.244-.705.08-3.033-1.517-4.148-2.224-5.836-5.114-.26-.445.26-.413.743-1.378.1-.2.05-.376-.025-.541-.075-.165-.732-1.764-1.002-2.414-.262-.63-.53-.544-.732-.555-.187-.01-.403-.012-.619-.012-.216 0-.569.081-.866.406-.297.329-1.135 1.109-1.135 2.703 0 1.594 1.16 3.134 1.321 3.352.162.217 2.28 3.483 5.525 4.881.772.333 1.374.531 1.843.68.777.247 1.485.212 2.046.128.625-.094 1.947-.796 2.221-1.564.275-.768.275-1.428.193-1.564-.083-.136-.302-.218-.63-.383z"/>
                        </svg>
                        <span>+{selectedOrder.customer_whatsapp}</span>
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant block">Dirección de Entrega</span>
                      <span className="font-bold text-on-surface flex items-start gap-1">
                        <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                        {selectedOrder.customer_address || "No especificada"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Order Metadata */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" /> Información de Pago
                  </h4>
                  <div className="p-4 bg-surface-container/30 border border-outline/5 rounded-xl space-y-2">
                    <div>
                      <span className="text-xs text-on-surface-variant block">Método de Pago</span>
                      <span className="font-bold text-on-surface capitalize flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                        {selectedOrder.payment_method === "yape" ? "Yape / Plin" : "Contraentrega"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant block">Fecha del Pedido</span>
                      <span className="font-bold text-on-surface">
                        {new Date(selectedOrder.created_at).toLocaleString("es-PE")}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant block">Estado del Pedido</span>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                  Productos Ordenados
                </h4>
                <div className="border border-outline/10 rounded-xl overflow-hidden">
                  {selectedOrder.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border-b border-outline/5 last:border-b-0 bg-surface-container/10"
                    >
                      <div className="flex items-center gap-3">
                        {item.products?.image_url ? (
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-10 h-10 object-cover rounded-lg border border-outline/10"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">
                            IMG
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-on-surface">{item.products?.name || "Producto no disponible"}</div>
                          <div className="text-xs text-on-surface-variant">
                            Precio de Compra: S/. {Number(item.price_at_purchase).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-on-surface">x{item.quantity}</div>
                        <div className="text-xs text-primary font-bold">
                          S/. {(item.quantity * item.price_at_purchase).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-surface-container/20 border-t border-outline/10 flex justify-between items-center font-bold text-base text-on-surface">
                    <span>Total del Pedido:</span>
                    <span className="text-primary">
                      S/. {Number(selectedOrder.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Proof Upload Area */}
              {selectedOrder.payment_method === "yape" && (
                <div className="space-y-3 p-4 border border-outline/10 rounded-xl bg-surface-container/10">
                  <h4 className="font-bold text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-4 h-4 text-primary" /> Comprobante de Pago (Yape/Plin)
                  </h4>
                  
                  {selectedOrder.payment_proof_url ? (
                    <div className="space-y-3">
                      <div className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Comprobante cargado en el sistema
                      </div>
                      <a
                        href={selectedOrder.payment_proof_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-all"
                      >
                        Ver Comprobante <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={handleUploadSubmit} className="space-y-3">
                      <div className="text-xs text-on-surface-variant">
                        Sube una captura de pantalla del Yape/Plin para este pedido para validarlo:
                      </div>
                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        <input
                          type="file"
                          name="payment_proof"
                          accept="image/*"
                          required
                          className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
                        />
                        <button
                          type="submit"
                          disabled={isUploading}
                          className="px-4 py-2 bg-primary text-on-primary hover:bg-primary/95 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <Upload className="w-4 h-4" />
                          {isUploading ? "Subiendo..." : "Subir Captura"}
                        </button>
                      </div>
                      {uploadError && (
                        <div className="text-xs text-rose-500 font-semibold">{uploadError}</div>
                      )}
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-outline/10 bg-surface-container/20 flex flex-wrap gap-3 justify-end">
              {/* ACCIONES PARA PEDIDO PENDIENTE */}
              {selectedOrder.status === "pending" && (
                <>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, "cancelled")}
                    className="px-4 py-2 border border-rose-500/30 hover:bg-rose-500/10 text-rose-500 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancelar Pedido
                  </button>
                  
                  {selectedOrder.payment_method === "contraentrega" ? (
                    // Contraentrega: Se envía antes de cobrar
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, "shipped")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Truck className="w-4 h-4" /> Registrar Envío (Enviar)
                    </button>
                  ) : (
                    // Yape/Plin: Se cobra antes de enviar
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, "paid")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Confirmar Pago
                    </button>
                  )}
                </>
              )}

              {/* ACCIONES PARA PEDIDO ENVIADO (Solo aplica para Contraentrega para marcar como cobrado al entregar) */}
              {selectedOrder.status === "shipped" && selectedOrder.payment_method === "contraentrega" && (
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, "paid")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Confirmar Pago (Entregado)
                </button>
              )}

              {/* ACCIONES PARA PEDIDO PAGADO (Solo aplica para Yape/Plin para registrar el envío) */}
              {selectedOrder.status === "paid" && selectedOrder.payment_method !== "contraentrega" && (
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, "shipped")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Truck className="w-4 h-4" /> Marcar como Enviado
                </button>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-surface-container hover:bg-surface-container/80 text-on-surface-variant text-xs font-bold rounded-xl transition-all cursor-pointer"
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
