import { Edit, RefreshCw, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminImage } from "../../components/AdminImage";
import { AdminStatCard } from "../../components/AdminStatCard";
import { getProducts } from "../../features/adminProducts/adminProductApi";
import type { ProductMediaResponse, ProductResponse } from "../../features/adminProducts/adminProductTypes";

type ProductMediaItem = ProductMediaResponse & {
  productId: number;
  productName: string;
};

type MediaFilter = "ALL" | "THUMBNAIL" | "ACTIVE" | "INACTIVE";

export default function ProductMedia() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<MediaFilter>("ALL");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      setProducts(await getProducts());
    } catch (error) {
      console.error("Failed to load product media:", error);
      setError("Could not load product media.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const mediaItems: ProductMediaItem[] = products.flatMap((product) =>
    product.media.map((media) => ({
      ...media,
      productId: product.id,
      productName: product.name,
    }))
  );

  const filteredMedia = mediaItems.filter((item) => {
    const keyword = searchTerm.toLowerCase();
    const matchesKeyword =
      item.productName.toLowerCase().includes(keyword) ||
      item.url.toLowerCase().includes(keyword) ||
      (item.altText ?? "").toLowerCase().includes(keyword);

    if (!matchesKeyword) return false;
    if (filter === "THUMBNAIL") return item.thumbnail;
    if (filter === "ACTIVE") return item.active;
    if (filter === "INACTIVE") return !item.active;
    return true;
  });

  const filterOptions: Array<{ label: string; value: MediaFilter }> = [
    { label: "All", value: "ALL" },
    { label: "Thumbnails", value: "THUMBNAIL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Product Media</h2>
          <p className="text-sm text-gray-500">Browse product images and jump into product edit to manage them.</p>
        </div>
        <button
          type="button"
          onClick={loadProducts}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Media" value={mediaItems.length} />
        <AdminStatCard label="Products" value={products.length} />
        <AdminStatCard label="Thumbnails" value={mediaItems.filter((item) => item.thumbnail).length} />
        <AdminStatCard label="Inactive" value={mediaItems.filter((item) => !item.active).length} />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5">
          <div>
            <h3 className="font-bold text-gray-900">Media Library</h3>
            <p className="mt-1 text-xs font-medium text-gray-500">Showing {filteredMedia.length} of {mediaItems.length} media</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                    filter === option.value ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search product, url, alt"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-gray-500">Loading media...</div>}
        {!loading && error && <div className="p-6 text-sm font-semibold text-red-600">{error}</div>}
        {!loading && !error && filteredMedia.length === 0 && <div className="p-6 text-sm text-gray-500">No media found.</div>}
        {!loading && !error && filteredMedia.length > 0 && (
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredMedia.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-gray-200">
                <div className="aspect-video bg-gray-100">
                  <AdminImage src={item.url} alt={item.altText ?? item.productName} />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-bold text-gray-900">{item.productName}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">{item.url}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge active={item.thumbnail}>Thumbnail</Badge>
                    <Badge active={item.active}>{item.active ? "Active" : "Inactive"}</Badge>
                    <Badge active>{item.mediaType}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-500">Sort order {item.sortOrder}</p>
                    <Link
                      to={`/admin/products/${item.productId}/edit`}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Product
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
      {children}
    </span>
  );
}
