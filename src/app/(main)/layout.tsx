import { Navbar } from "../_components/navbar";
import { SSideBar } from "../_components/side-bar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex min-h-screen">
        <SSideBar />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden w-full">
          <Navbar />
          {children}
        </div>
      </div>
    </>
  );
}
