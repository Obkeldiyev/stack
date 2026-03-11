export function formatCurrencyFromCents(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  return `$${(amount / 100).toFixed(2)}`;
}

export function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `$${amount.toFixed(2)}`;
}

export function getFamilyId(record: any) {
  return record?.familyId ?? record?.family?.id ?? record?.id ?? 0;
}

export function getFamilyTitle(record: any) {
  return record?.familyTitle ?? record?.family?.title ?? record?.title ?? "Family";
}

export function getFamilyRole(record: any) {
  return record?.memberRole ?? record?.role ?? record?.familyRole ?? null;
}

export function normalizeFamilyMember(member: any) {
  const user = member?.user ?? member;
  return {
    id: member?.id ?? user?.id ?? 0,
    userId: user?.id ?? member?.userId ?? 0,
    username: user?.username ?? member?.username ?? "Member",
    role: member?.memberRole ?? member?.role ?? user?.role ?? "CHILD",
  };
}
