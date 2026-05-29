import { Outlet, useLocation } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function MainLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900">
      <div className="mesh-bg pointer-events-none fixed inset-0 -z-20" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_20%,rgba(244,111,113,0.2),transparent_45%),radial-gradient(circle_at_88%_16%,rgba(255,170,177,0.25),transparent_35%),radial-gradient(circle_at_75%_85%,rgba(255,220,223,0.36),transparent_42%)]" />

      {!isHome ? <Navbar /> : null}

      <main
        className={`mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 ${isHome ? "pt-0" : "pt-24 sm:pt-28"}`}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
