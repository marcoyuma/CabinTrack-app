// phone is PII the admin panel is deliberately, narrowly allowed to see (see
// ADMIN-PANEL-CONTEXT.md § "Akses baca staff/manager ke data guest") — mask most of it by
// default instead of rendering it in full.
export const maskPhone = (
    phoneCountryCode: string | null,
    phone: string | null,
): string => {
    if (!phone) return "—";
    const visibleTail = phone.slice(-4);
    const masked = "•".repeat(Math.max(phone.length - 4, 0)) + visibleTail;
    return phoneCountryCode ? `${phoneCountryCode} ${masked}` : masked;
};
