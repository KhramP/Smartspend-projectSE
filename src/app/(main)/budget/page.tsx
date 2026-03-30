import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBudgetOverview } from "../../actions/transaction";
import "../../_components/GlobalLayout.css";

export default async function BudgetPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user!.id;

  const budget = await getBudgetOverview({ userId });

  const totalBudget = budget.totalIncome || budget.totalSpent || 1;
  const totalUsed = budget.totalSpent;
  const remaining = budget.remaining;
  const overallPercent = totalBudget > 0 ? (totalUsed / totalBudget) * 100 : 0;

  return (
    <div className="p-10">
      <h2 className="text-2xl font-semibold text-white mb-6">งบประมาณ</h2>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* ส่วนซ้าย: ภาพรวมงบประมาณเดือนนี้ */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">ภาพรวมงบประมาณเดือนนี้</h3>
            <button className="btn-premium" style={{ borderRadius: "20px", padding: "5px 15px" }}>
              ตั้งงบใหม่
            </button>
          </div>

          <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
            <div className="stat-card bg-black/20 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">งบรวม</p>
              <h4 className="text-xl font-bold">฿{totalBudget.toLocaleString()}</h4>
            </div>
            <div className="stat-card bg-black/20 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">ใช้ไปแล้ว</p>
              <h4 className="text-xl font-bold text-red-400">฿{totalUsed.toLocaleString()}</h4>
            </div>
            <div className="stat-card bg-black/20 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">คงเหลือ</p>
              <h4 className="text-xl font-bold text-green-400">฿{remaining.toLocaleString()}</h4>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>ภาพรวม {overallPercent.toFixed(1)}% ของงบทันหมด</span>
            </div>
            <div className="gold-progress-bar" style={{ height: "12px" }}>
              <div className="gold-progress-fill" style={{ width: `${overallPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* ส่วนขวา: สัดส่วนงบที่ใช้ (Donut Chart จำลอง) */}
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-gray-400 mb-4 self-start">สัดส่วนงบที่ใช้</h3>
          <div className="relative w-40 h-40 rounded-full border-[10px] border-gray-700 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-white">{Math.round(overallPercent)}%</span>
              <p className="text-[10px] text-gray-400">ใช้ไปแล้ว</p>
            </div>
            {/* วงแหวนสีทองจำลองสัดส่วน */}
            <div className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-t-[var(--accent-gold)] border-r-[var(--accent-gold)] transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* แถวล่าง: การ์ดงบประมาณแยกตามหมวดหมู่ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {budget.categories.length === 0 ? (
          <div className="glass-card p-5 col-span-4 text-center text-gray-500 py-12">
            ยังไม่มีข้อมูลค่าใช้จ่ายเดือนนี้
          </div>
        ) : (
          budget.categories.map((cat) => {
            const percent = totalUsed > 0 ? (cat.spent / totalUsed) * 100 : 0;

            return (
              <div key={cat.name} className="glass-card p-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <span>{cat.icon}</span> {cat.name}
                    </h4>
                    <p className="text-[10px] text-gray-400">{cat.count} รายการเดือนนี้</p>
                  </div>
                  <div className="text-sm font-bold text-[var(--accent-green)]">{percent.toFixed(0)}%</div>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">ใช้ไป</span>
                    <span className="text-white font-semibold">฿{cat.spent.toLocaleString()}</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent-gold)]"
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
