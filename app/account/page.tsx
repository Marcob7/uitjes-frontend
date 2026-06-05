import type { Metadata } from "next";

import AccountPageClient from "./AccountPageClient";

export const metadata: Metadata = {
  title: "Account | Uitjes NL",
  description: "Bekijk je accountstatus en ga snel naar je bewaarde uitjes.",
  alternates: {
    canonical: "/account",
  },
};

export default function AccountPage() {
  return <AccountPageClient />;
}
