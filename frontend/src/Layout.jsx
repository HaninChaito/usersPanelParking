import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main
        style={{
          paddingTop: "50px",
          paddingBottom: "60px",
          minHeight: "calc(100vh - 160px)",
          boxSizing: "border-box",
          paddingInline: "1rem",
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
