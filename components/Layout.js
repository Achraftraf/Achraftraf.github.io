import { Sora } from "@next/font/google";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import Header from "../components/Header";
import TopLeftImg from "../components/TopLeftImg";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const Layout = ({ children }) => {
  const router = useRouter();
  const noHeaderRoutes = ["/testimonials"]; // Routes without Header

  return (
    <div
      className={`page bg-site text-white bg-cover bg-no-repeat ${sora.variable} font-sora relative`}
    >
      <TopLeftImg />
      <Nav />
      {!noHeaderRoutes.includes(router.pathname) && <Header />}
      {children}
    </div>
  );
};

export default Layout;
