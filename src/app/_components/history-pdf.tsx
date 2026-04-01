import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
  ],
});

const green = "#9BD104";
const incomeColor = "#10b981";
const expenseColor = "#ef4444";

const s = StyleSheet.create({
  page: { fontFamily: "Sarabun", padding: 40, fontSize: 10, color: "#222" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#666", marginBottom: 2 },
  headerBar: { marginTop: 16, marginBottom: 0 },
  headerRow: {
    flexDirection: "row",
    backgroundColor: green,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  headerCell: { fontWeight: "bold", fontSize: 9, color: "#000" },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  rowAlt: { backgroundColor: "#f5f5f5" },
  cell: { fontSize: 9 },
  colDate: { width: "18%" },
  colName: { width: "30%" },
  colCat: { width: "22%" },
  colType: { width: "12%" },
  colAmt: { width: "18%", textAlign: "right" },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  summaryLabel: { fontSize: 10, color: "#666" },
  summaryValue: { fontSize: 12, fontWeight: "bold" },
  incomeText: { color: incomeColor },
  expenseText: { color: expenseColor },
});

type Tx = {
  date: Date | string;
  name: string | null;
  category: string | null;
  type: string;
  amount: number;
};

function fmtDate(d: Date | string) {
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear() + 543;
  return `${dd}-${mm}-${yyyy}`;
}

export function HistoryPDFDocument({ transactions }: { transactions: Tx[] }) {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.title}>SmartSpend - ประวัติรายการ</Text>
        <Text style={s.subtitle}>วันที่สร้าง: {fmtDate(new Date())}</Text>
        <Text style={s.subtitle}>จำนวนรายการ: {transactions.length} รายการ</Text>

        <View style={s.headerBar}>
          <View style={s.headerRow}>
            <Text style={[s.headerCell, s.colDate]}>วันที่</Text>
            <Text style={[s.headerCell, s.colName]}>ชื่อรายการ</Text>
            <Text style={[s.headerCell, s.colCat]}>หมวดหมู่</Text>
            <Text style={[s.headerCell, s.colType]}>ประเภท</Text>
            <Text style={[s.headerCell, s.colAmt]}>จำนวน</Text>
          </View>

          {transactions.map((tx, i) => (
            <View key={i} style={[s.row, ...(i % 2 === 1 ? [s.rowAlt] : [])]}>
              <Text style={[s.cell, s.colDate]}>{fmtDate(tx.date)}</Text>
              <Text style={[s.cell, s.colName]}>{tx.name ?? "-"}</Text>
              <Text style={[s.cell, s.colCat]}>{tx.category ?? "-"}</Text>
              <Text style={[s.cell, s.colType]}>{tx.type === "income" ? "รายรับ" : "รายจ่าย"}</Text>
              <Text
                style={[s.cell, s.colAmt, tx.type === "income" ? s.incomeText : s.expenseText, { fontWeight: "bold" }]}
              >
                {tx.type === "income" ? "+" : "-"}฿{tx.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={s.summary}>
          <View>
            <Text style={s.summaryLabel}>รายรับรวม</Text>
            <Text style={[s.summaryValue, s.incomeText]}>+฿{totalIncome.toLocaleString()}</Text>
          </View>
          <View>
            <Text style={s.summaryLabel}>รายจ่ายรวม</Text>
            <Text style={[s.summaryValue, s.expenseText]}>-฿{totalExpense.toLocaleString()}</Text>
          </View>
          <View>
            <Text style={s.summaryLabel}>ยอดคงเหลือ</Text>
            <Text style={[s.summaryValue, { color: totalIncome - totalExpense >= 0 ? incomeColor : expenseColor }]}>
              ฿{(totalIncome - totalExpense).toLocaleString()}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
