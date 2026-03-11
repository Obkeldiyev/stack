import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatCurrencyFromCents } from "@/lib/view-models";
import { toast } from "sonner";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    void loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setTransactions(await adminApi.getAllTransactions());
    } catch (error: any) {
      toast.error(error.message || "Failed to load transactions");
    }
  };

  return (
    <AdminShell active="transactions" title="Transaction oversight" subtitle="Audit ledger activity with account and owner context instead of raw IDs only.">
      <section className="panel-card">
        <div className="section-title">
          <div>
            <h2 className="section-heading">Ledger activity</h2>
            <p className="section-subtitle">Every transaction with account owner and stored note.</p>
          </div>
        </div>
        <div className="goal-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="info-row">
              <div>
                <strong>{transaction.type}</strong>
                <div className="muted-copy" style={{ marginTop: "4px" }}>
                  Account #{transaction.accountId} · {transaction.ownerUsername ?? "Unknown owner"}
                </div>
                <div className="muted-copy" style={{ marginTop: "4px" }}>
                  {transaction.note || "No note"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>{formatCurrencyFromCents(transaction.amount)}</strong>
                <div className="muted-copy" style={{ marginTop: "4px" }}>
                  {new Date(transaction.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
