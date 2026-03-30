import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCategoryData } from "../../actions/transaction";
import "../../_components/GlobalLayout.css";

export default async function CategoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user!.id;

  const categories = await getCategoryData({ userId });

  return (
    <div className="p-10">
      <h2 className="text-2xl font-semibold text-white mb-6">หมวดหมู่</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        {categories.length === 0 ? (
          <div className="glass-card col-span-3 text-center text-gray-500 py-20" style={{ padding: "24px" }}>
            ยังไม่มีข้อมูลหมวดหมู่เดือนนี้
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.name} className="category-card glass-card" style={{ padding: "24px" }}>
              <div className="category-header">
                <span className="category-icon" style={{ fontSize: "24px" }}>
                  {cat.icon}
                </span>
                <div>
                  <span className="category-title" style={{ display: "block", fontSize: "18px" }}>
                    {cat.name}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted-text)" }}>{cat.count} รายการ • เดือนนี้</span>
                </div>
              </div>
              <p className="category-amount" style={{ marginTop: "10px" }}>
                ฿{cat.amount.toLocaleString()}
              </p>
              <div className="gold-progress-bar">
                <div className="gold-progress-fill" style={{ width: `${cat.percent}%` }}></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
