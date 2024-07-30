import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { Children } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
