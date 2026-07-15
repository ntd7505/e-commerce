import { Edit, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Badge, Container, Section } from "../../components/common";
import { AdminImage } from "../../components/admin/AdminImage";
import { AdminStatCard } from "../../components/admin/AdminStatCard";
import { getProducts } from "../../features/admin/products/adminProductApi";
import type { ProductMediaResponse, ProductResponse } from "../../features/admin/products/adminProductTypes";

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
      setError("Không thể tải danh sách hình ảnh sản phẩm.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    { label: "Tất cả", value: "ALL" },
    { label: "Ảnh đại diện", value: "THUMBNAIL" },
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Đang ẩn", value: "INACTIVE" },
  ];

  return (
    <Container size="wide">
      <Section spacing="md" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text">Quản lý Hình ảnh (Media)</h2>
            <p className="mt-1 text-sm text-muted">Duyệt hình ảnh sản phẩm toàn hệ thống và truy cập chỉnh sửa để quản lý.</p>
          </div>
          <Button
            onClick={loadProducts}
            disabled={loading}
            variant="outline"
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
          >
            Làm mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard label="Tổng số hình ảnh" value={mediaItems.length} />
          <AdminStatCard label="Số sản phẩm" value={products.length} />
          <AdminStatCard label="Ảnh đại diện (Thumbnail)" value={mediaItems.filter((item) => item.thumbnail).length} />
          <AdminStatCard label="Hình ảnh ẩn" value={mediaItems.filter((item) => !item.active).length} />
        </div>

        {/* Media Library Panel */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
            <div>
              <h3 className="font-bold text-text">Thư viện Hình ảnh</h3>
              <p className="mt-1 text-xs font-semibold text-muted">Đang hiển thị {filteredMedia.length} trên tổng số {mediaItems.length} ảnh</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter tabs */}
              <div className="flex rounded-lg border border-border bg-surface-alt p-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-all ${
                      filter === option.value
                        ? "bg-surface text-primary shadow-sm"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {/* Search input */}
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Tìm theo sản phẩm, URL, thẻ alt..."
                  className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {loading && (
            <div className="p-10 text-center text-sm font-semibold text-muted">Đang tải thư viện ảnh...</div>
          )}
          {!loading && error && (
            <div className="p-10 text-center text-sm font-semibold text-danger">{error}</div>
          )}
          {!loading && !error && filteredMedia.length === 0 && (
            <div className="p-10 text-center text-sm font-semibold text-muted">Không tìm thấy hình ảnh nào.</div>
          )}
          {!loading && !error && filteredMedia.length > 0 && (
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedia.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md hover:border-primary/20 flex flex-col">
                  <div className="aspect-video bg-surface-alt relative overflow-hidden flex items-center justify-center p-2 border-b border-border">
                    <AdminImage
                      src={item.url}
                      alt={item.altText ?? item.productName}
                      className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
                      fallbackClassName="h-full w-full"
                    />
                  </div>
                  <div className="space-y-4 p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="font-bold text-text line-clamp-1" title={item.productName}>{item.productName}</p>
                      <p className="truncate text-xs text-muted" title={item.url}>{item.url}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant={item.thumbnail ? "success" : "neutral"} size="sm">
                        {item.thumbnail ? "Ảnh đại diện" : "Ảnh phụ"}
                      </Badge>
                      <Badge variant={item.active ? "primary" : "neutral"} size="sm">
                        {item.active ? "Đang hoạt động" : "Đã ẩn"}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {item.mediaType}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-2">
                      <p className="text-xs font-semibold text-muted">Thứ tự: {item.sortOrder}</p>
                      <Link
                        to={`/admin/products/${item.productId}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-bold text-text transition-colors hover:bg-surface-alt"
                      >
                        <Edit className="h-3.5 w-3.5 text-muted" />
                        Sửa sản phẩm
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </Container>
  );
}
