import { useEffect, useState } from "react";
import { Award, FolderTree, Package, Users } from "lucide-react";
import { getProducts } from "../../adminProducts/adminProductApi";
import { getBrands } from "../../brands/adminBrandApi";
import { getCategories } from "../../categories/adminCategoryApi";
import { getAdminUsers } from "../../customers/adminUserApi";

type DashboardMetrics = {
  products: number;
  activeProducts: number;
  brands: number;
  categories: number;
  users: number;
};

const emptyMetrics: DashboardMetrics = {
  products: 0,
  activeProducts: 0,
  brands: 0,
  categories: 0,
  users: 0,
};

export default function AdminDashboardSummary() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(emptyMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [products, brands, categories, users] = await Promise.all([
          getProducts(),
          getBrands(),
          getCategories(),
          getAdminUsers(),
        ]);

        setMetrics({
          products: products.length,
          activeProducts: products.filter((product) => product.active).length,
          brands: brands.length,
          categories: categories.length,
          users: users.length,
        });
        setError("");
      } catch (requestError) {
        console.error("Failed to load dashboard metrics:", requestError);
        setError("Không thể tải số liệu dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const cards = [
    { label: "Products", value: metrics.products, icon: Package, detail: `${metrics.activeProducts} active` },
    { label: "Brands", value: metrics.brands, icon: Award, detail: "Catalog brands" },
    { label: "Categories", value: metrics.categories, icon: FolderTree, detail: "Catalog categories" },
    { label: "Users", value: metrics.users, icon: Users, detail: "Registered accounts" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      <div>
        <h2 className="text-[22px] font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-[13px] text-gray-500">Số liệu tổng quan lấy từ các API admin hiện có.</p>
      </div>

      {error && <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-bold uppercase text-gray-400">{card.label}</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-gray-900">{loading ? "-" : card.value}</p>
            <p className="mt-1 text-[12px] font-medium text-gray-500">{card.detail}</p>
          </article>
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-[16px] font-bold text-gray-900">Operational coverage</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {[
            "Products, media, variants, brands and categories are connected to backend APIs.",
            "Customers use the admin users API. Backend does not expose order metrics yet.",
            "Coupons, product reviews and transactions need backend endpoints before real data can be shown.",
            "Roles and permissions are managed through the existing role and permission APIs.",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-[13px] font-medium text-gray-600">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
