import AppLayout from "@/components/layout/AppLayout";

export default function POSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}