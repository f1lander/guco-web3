export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col mt-16">
      {children}
    </div>
  );
}
