"use client";

import { useEffect, useMemo, useState } from "react";
import { TShirtPreview } from "@/components/studio";
import { TSHIRT_COLORS, type TShirtColorId } from "@/constants/colors";

interface OrderVariantAdmin {
  tshirtColor: string;
  tshirtSize: string;
  quantity: number;
  designUrl: string;
  backDesignUrl?: string;
  designPositionY?: number;
  designScale?: number;
  designAspectRatio?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressLine: string;
  city: string;
  pincode: string;
  state: string;
  tshirtColor: string;
  tshirtSize: string;
  quantity: number;
  designUrl: string;
  backDesignUrl?: string;
  designPositionY?: number;
  designScale?: number;
  designAspectRatio?: string;
  variants?: OrderVariantAdmin[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

interface OrderImageAsset {
  id: string;
  side: "front" | "back";
  label: string;
  image: string;
  colorId: TShirtColorId;
  colorName: string;
  size: string;
  quantity: number;
  designPositionY: number;
  designScale: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-slate-100 text-slate-800",
  confirmed: "bg-sky-100 text-sky-800",
  processing: "bg-cyan-100 text-cyan-800",
  printing: "bg-teal-100 text-teal-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

const COLOR_ID_BY_NAME = Object.entries(TSHIRT_COLORS).reduce<Record<string, TShirtColorId>>((acc, [id, value]) => {
  acc[value.name.toLowerCase()] = id as TShirtColorId;
  return acc;
}, {});

function resolveColorId(rawColor?: string): TShirtColorId {
  if (!rawColor) {
    return "pure-white";
  }

  const normalized = rawColor.trim().toLowerCase();
  const dashed = normalized.replace(/\s+/g, "-");

  if (dashed in TSHIRT_COLORS) {
    return dashed as TShirtColorId;
  }

  if (normalized in COLOR_ID_BY_NAME) {
    return COLOR_ID_BY_NAME[normalized];
  }

  return "pure-white";
}

function toImageSrc(value: string): string {
  if (!value) {
    return "";
  }

  if (
    value.startsWith("data:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {
    return value;
  }

  return `data:image/png;base64,${value}`;
}

function formatRelativeTime(dateString: string): string {
  const deltaMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.max(1, Math.floor(deltaMs / (1000 * 60)));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function downloadDesign(value: string, fileName: string) {
  const source = toImageSrc(value);
  const mimeMatch = source.match(/^data:image\/([^;]+);/i);
  const ext = mimeMatch ? mimeMatch[1].replace("jpeg", "jpg") : "png";

  const link = document.createElement("a");
  link.href = source;
  link.download = `${fileName}.${ext}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function buildOrderAssets(order: Order): OrderImageAsset[] {
  if (order.variants && order.variants.length > 0) {
    const assets: OrderImageAsset[] = [];

    order.variants.forEach((variant, index) => {
      const colorId = resolveColorId(variant.tshirtColor);
      const colorName = TSHIRT_COLORS[colorId].name;
      const variantLabel = `Item ${index + 1}`;

      assets.push({
        id: `${order._id}-v${index + 1}-front`,
        side: "front",
        label: `${variantLabel} Front`,
        image: variant.designUrl,
        colorId,
        colorName,
        size: variant.tshirtSize,
        quantity: variant.quantity,
        designPositionY:
          typeof variant.designPositionY === "number"
            ? variant.designPositionY
            : typeof order.designPositionY === "number"
              ? order.designPositionY
              : 35,
        designScale:
          typeof variant.designScale === "number"
            ? variant.designScale
            : typeof order.designScale === "number"
              ? order.designScale
              : 1,
      });

      if (variant.backDesignUrl) {
        assets.push({
          id: `${order._id}-v${index + 1}-back`,
          side: "back",
          label: `${variantLabel} Back`,
          image: variant.backDesignUrl,
          colorId,
          colorName,
          size: variant.tshirtSize,
          quantity: variant.quantity,
          designPositionY:
            typeof variant.designPositionY === "number"
              ? variant.designPositionY
              : typeof order.designPositionY === "number"
                ? order.designPositionY
                : 35,
          designScale:
            typeof variant.designScale === "number"
              ? variant.designScale
              : typeof order.designScale === "number"
                ? order.designScale
                : 1,
        });
      }
    });

    return assets;
  }

  const colorId = resolveColorId(order.tshirtColor);
  const colorName = TSHIRT_COLORS[colorId].name;
  const assets: OrderImageAsset[] = [
    {
      id: `${order._id}-front`,
      side: "front",
      label: "Front",
      image: order.designUrl,
      colorId,
      colorName,
      size: order.tshirtSize,
      quantity: order.quantity,
      designPositionY: typeof order.designPositionY === "number" ? order.designPositionY : 35,
      designScale: typeof order.designScale === "number" ? order.designScale : 1,
    },
  ];

  if (order.backDesignUrl) {
    assets.push({
      id: `${order._id}-back`,
      side: "back",
      label: "Back",
      image: order.backDesignUrl,
      colorId,
      colorName,
      size: order.tshirtSize,
      quantity: order.quantity,
      designPositionY: typeof order.designPositionY === "number" ? order.designPositionY : 35,
      designScale: typeof order.designScale === "number" ? order.designScale : 1,
    });
  }

  return assets;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"preview" | "details">("preview");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (orderModalOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [orderModalOpen, isMobile]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!orders.length) {
      setSelectedOrderId(null);
      return;
    }

    setSelectedOrderId((prev) => {
      if (prev && orders.some((order) => order._id === prev)) {
        return prev;
      }
      return orders[0]._id;
    });
  }, [orders]);

  const selectedOrder = useMemo(() => {
    if (!orders.length) {
      return null;
    }

    return orders.find((order) => order._id === selectedOrderId) ?? orders[0];
  }, [orders, selectedOrderId]);

  const selectedOrderAssets = useMemo(
    () => (selectedOrder ? buildOrderAssets(selectedOrder) : []),
    [selectedOrder]
  );

  useEffect(() => {
    if (!selectedOrderAssets.length) {
      setSelectedAssetId(null);
      return;
    }

    setSelectedAssetId((prev) => {
      if (prev && selectedOrderAssets.some((asset) => asset.id === prev)) {
        return prev;
      }
      return selectedOrderAssets[0].id;
    });
  }, [selectedOrderAssets]);

  const selectedAsset = useMemo(() => {
    if (!selectedOrderAssets.length) {
      return null;
    }

    return selectedOrderAssets.find((asset) => asset.id === selectedAssetId) ?? selectedOrderAssets[0];
  }, [selectedOrderAssets, selectedAssetId]);

  async function fetchOrders() {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrders((prev) => prev.map((order) => (order._id === orderId ? data.order : order)));
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  if (orders.length === 0 || !selectedOrder) {
    return (
      <div>
        <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)] mb-8">Orders</h1>
        <div className="text-center py-12 text-[var(--text-secondary)]">No orders found</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8.5rem)] min-h-[740px] rounded-3xl border border-[var(--border-default)] bg-[var(--surface-raised)] overflow-hidden">
      <div className="h-full grid grid-cols-1 lg:grid-cols-[360px_1fr]">
        <aside className="h-full min-h-0 border-r border-[var(--border-default)] bg-[var(--surface-overlay)] flex flex-col">
          <div className="px-4 py-4 border-b border-[var(--border-default)]">
            <h1 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Active Queue</h1>
          </div>

          <div className="p-3 space-y-2 overflow-y-auto min-h-0">
            {orders.map((order) => {
              const isActive = order._id === selectedOrder._id;

              return (
                <button
                  key={order._id}
                  type="button"
                  onClick={() => {
                    setSelectedOrderId(order._id);
                    if (isMobile) {
                      setModalTab("preview");
                      setOrderModalOpen(true);
                    }
                  }}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${
                    isActive
                      ? "bg-white border-[var(--accent-primary)] shadow-sm"
                      : "bg-transparent border-transparent hover:bg-white/80 hover:border-[var(--border-default)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[11px] text-[var(--text-tertiary)] font-medium">
                      {formatRelativeTime(order.createdAt)}
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)] leading-snug">
                    {order.customerName}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        STATUS_COLORS[order.status] || "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-base font-bold text-[var(--text-primary)]">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="hidden lg:block h-full min-h-0 overflow-y-auto bg-[var(--surface-default)] p-4 md:p-6 space-y-4">
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Order</p>
                <h2 className="mt-1 text-2xl font-serif font-black text-[var(--text-primary)]">
                  #{selectedOrder.orderNumber}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                    STATUS_COLORS[selectedOrder.status] || "bg-slate-100 text-slate-800"
                  }`}
                >
                  {selectedOrder.status}
                </span>
                <span className="text-xl font-bold text-[var(--text-primary)]">₹{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_360px] gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                      {selectedAsset?.label ?? "Design"}
                    </p>
                    {selectedAsset && (
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {selectedAsset.colorName} / {selectedAsset.size} × {selectedAsset.quantity}
                      </p>
                    )}
                  </div>

                  {selectedAsset && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadDesign(
                          selectedAsset.image,
                          `order-${selectedOrder.orderNumber}-${selectedAsset.label.toLowerCase().replace(/\s+/g, "-")}`
                        )
                      }
                      className="h-9 px-4 rounded-lg border border-[var(--border-default)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-inset)] transition-colors"
                    >
                      Download PNG
                    </button>
                  )}
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-inset)] p-4">
                  <TShirtPreview
                    color={selectedAsset?.colorId ?? "pure-white"}
                    designImage={selectedAsset?.side === "front" ? toImageSrc(selectedAsset.image) : null}
                    backDesignImage={selectedAsset?.side === "back" ? toImageSrc(selectedAsset.image) : null}
                    designPosition={{
                      y: selectedAsset?.designPositionY ?? 35,
                      scale: selectedAsset?.designScale ?? 1,
                    }}
                    backDesignPosition={{
                      y: selectedAsset?.designPositionY ?? 35,
                      scale: selectedAsset?.designScale ?? 1,
                    }}
                    side={selectedAsset?.side ?? "front"}
                    size="lg"
                    className="max-w-[560px]"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 md:p-5">
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">PNG Files</p>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedOrderAssets.map((asset) => {
                    const isActive = selectedAsset?.id === asset.id;
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`rounded-xl border p-2 text-left transition-all ${
                          isActive
                            ? "border-[var(--accent-primary)] bg-[var(--surface-default)]"
                            : "border-[var(--border-default)] bg-white hover:bg-[var(--surface-default)]"
                        }`}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden border border-[var(--border-default)] bg-[var(--surface-inset)]">
                          <img
                            src={toImageSrc(asset.image)}
                            alt={asset.label}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="mt-2 text-[11px] font-semibold text-[var(--text-primary)] truncate">{asset.label}</p>
                        <p className="text-[10px] text-[var(--text-tertiary)] truncate">{asset.colorName}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 md:p-5">
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Customer</p>
                <div className="mt-3 space-y-3 text-sm text-[var(--text-secondary)]">
                  <div>
                    <p className="text-lg font-semibold text-[var(--text-primary)] leading-tight">{selectedOrder.customerName}</p>
                    {selectedOrder.customerEmail && <p>{selectedOrder.customerEmail}</p>}
                    <p>+91 {selectedOrder.customerPhone}</p>
                  </div>
                  <div className="pt-3 border-t border-[var(--border-default)]">
                    <p>{selectedOrder.addressLine}</p>
                    <p>
                      {selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 md:p-5">
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Order Info</p>

                <div className="mt-3 space-y-3 text-sm text-[var(--text-secondary)]">
                  <div className="flex items-center justify-between gap-3">
                    <span>Payment Method</span>
                    <span className="font-semibold capitalize text-[var(--text-primary)]">{selectedOrder.paymentMethod}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span>Payment Status</span>
                    <span className="font-semibold capitalize text-[var(--text-primary)]">{selectedOrder.paymentStatus}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span>Date</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
                      Update Status
                    </label>
                    <select
                      value={selectedOrder.status}
                      onChange={(event) => updateOrderStatus(selectedOrder._id, event.target.value)}
                      disabled={updatingId === selectedOrder._id}
                      className={`w-full h-10 px-3 rounded-lg text-sm font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        STATUS_COLORS[selectedOrder.status] || "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="printing">Printing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 md:p-5">
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Items</p>
                <div className="mt-3 space-y-2 text-sm">
                  {selectedOrderAssets.map((asset) => (
                    <div key={`item-${asset.id}`} className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-default)] px-3 py-2">
                      <p className="font-semibold text-[var(--text-primary)]">{asset.label}</p>
                      <p className="text-[var(--text-secondary)]">
                        {asset.colorName} / {asset.size} × {asset.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile order detail modal with Preview & Order Details tabs */}
      {orderModalOpen && isMobile && selectedOrder && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden
            onClick={() => setOrderModalOpen(false)}
          />
          <div
            className="fixed inset-x-0 bottom-0 top-[10%] z-50 lg:hidden bg-[var(--surface-raised)] rounded-t-2xl shadow-2xl border-t border-[var(--border-default)] flex flex-col animate-slide-up"
            role="dialog"
            aria-modal="true"
            aria-label={`Order ${selectedOrder.orderNumber}`}
          >
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--border-default)]">
              <h2 className="text-lg font-serif font-semibold text-[var(--text-primary)]">
                #{selectedOrder.orderNumber}
              </h2>
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)] transition-colors"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="shrink-0 flex border-b border-[var(--border-default)]">
              <button
                type="button"
                onClick={() => setModalTab("preview")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  modalTab === "preview"
                    ? "text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]"
                    : "text-[var(--text-tertiary)]"
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setModalTab("details")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  modalTab === "details"
                    ? "text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]"
                    : "text-[var(--text-tertiary)]"
                }`}
              >
                Order Details
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
              {modalTab === "preview" && (
                <>
                  <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
                          {selectedAsset?.label ?? "Design"}
                        </p>
                        {selectedAsset && (
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            {selectedAsset.colorName} / {selectedAsset.size} × {selectedAsset.quantity}
                          </p>
                        )}
                      </div>
                      {selectedAsset && (
                        <button
                          type="button"
                          onClick={() =>
                            downloadDesign(
                              selectedAsset.image,
                              `order-${selectedOrder.orderNumber}-${selectedAsset.label.toLowerCase().replace(/\s+/g, "-")}`
                            )
                          }
                          className="h-9 px-4 rounded-lg border border-[var(--border-default)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-inset)] transition-colors"
                        >
                          Download PNG
                        </button>
                      )}
                    </div>
                    <div className="mt-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-inset)] p-4 flex justify-center">
                      <TShirtPreview
                        color={selectedAsset?.colorId ?? "pure-white"}
                        designImage={selectedAsset?.side === "front" ? toImageSrc(selectedAsset.image) : null}
                        backDesignImage={selectedAsset?.side === "back" ? toImageSrc(selectedAsset.image) : null}
                        designPosition={{
                          y: selectedAsset?.designPositionY ?? 35,
                          scale: selectedAsset?.designScale ?? 1,
                        }}
                        backDesignPosition={{
                          y: selectedAsset?.designPositionY ?? 35,
                          scale: selectedAsset?.designScale ?? 1,
                        }}
                        side={selectedAsset?.side ?? "front"}
                        size="lg"
                        className="max-w-full"
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
                    <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">PNG Files</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {selectedOrderAssets.map((asset) => {
                        const isActive = selectedAsset?.id === asset.id;
                        return (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => setSelectedAssetId(asset.id)}
                            className={`rounded-xl border p-2 text-left transition-all ${
                              isActive
                                ? "border-[var(--accent-primary)] bg-[var(--surface-default)]"
                                : "border-[var(--border-default)] bg-white hover:bg-[var(--surface-default)]"
                            }`}
                          >
                            <div className="aspect-square rounded-lg overflow-hidden border border-[var(--border-default)] bg-[var(--surface-inset)]">
                              <img
                                src={toImageSrc(asset.image)}
                                alt={asset.label}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="mt-2 text-[11px] font-semibold text-[var(--text-primary)] truncate">{asset.label}</p>
                            <p className="text-[10px] text-[var(--text-tertiary)] truncate">{asset.colorName}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {modalTab === "details" && (
                <>
                  <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Order</p>
                        <h2 className="mt-1 text-xl font-serif font-black text-[var(--text-primary)]">
                          #{selectedOrder.orderNumber}
                        </h2>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                            STATUS_COLORS[selectedOrder.status] || "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {selectedOrder.status}
                        </span>
                        <span className="text-lg font-bold text-[var(--text-primary)]">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
                    <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Customer</p>
                    <div className="mt-3 space-y-3 text-sm text-[var(--text-secondary)]">
                      <div>
                        <p className="text-lg font-semibold text-[var(--text-primary)] leading-tight">{selectedOrder.customerName}</p>
                        {selectedOrder.customerEmail && <p>{selectedOrder.customerEmail}</p>}
                        <p>+91 {selectedOrder.customerPhone}</p>
                      </div>
                      <div className="pt-3 border-t border-[var(--border-default)]">
                        <p>{selectedOrder.addressLine}</p>
                        <p>
                          {selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
                    <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Order Info</p>
                    <div className="mt-3 space-y-3 text-sm text-[var(--text-secondary)]">
                      <div className="flex items-center justify-between gap-3">
                        <span>Payment Method</span>
                        <span className="font-semibold capitalize text-[var(--text-primary)]">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Payment Status</span>
                        <span className="font-semibold capitalize text-[var(--text-primary)]">{selectedOrder.paymentStatus}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Date</span>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="pt-2">
                        <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
                          Update Status
                        </label>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                          disabled={updatingId === selectedOrder._id}
                          className={`w-full h-10 px-3 rounded-lg text-sm font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            STATUS_COLORS[selectedOrder.status] || "bg-slate-100 text-slate-800"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="printing">Printing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
                    <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">Items</p>
                    <div className="mt-3 space-y-2 text-sm">
                      {selectedOrderAssets.map((asset) => (
                        <div key={`item-${asset.id}`} className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-default)] px-3 py-2">
                          <p className="font-semibold text-[var(--text-primary)]">{asset.label}</p>
                          <p className="text-[var(--text-secondary)]">
                            {asset.colorName} / {asset.size} × {asset.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
