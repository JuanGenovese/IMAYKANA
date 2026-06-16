import { SiteHeader } from "@/components/store/site-header";
import { SiteFooter } from "@/components/store/site-footer";
import { ScrollToTop } from "@/components/store/scroll-to-top";
import { WhatsAppButton } from "@/components/store/whatsapp-button";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <ScrollToTop />
      <WhatsAppButton />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
