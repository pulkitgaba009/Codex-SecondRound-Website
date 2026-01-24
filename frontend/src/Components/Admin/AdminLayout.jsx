import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import Layout from "../Layout";

function AdminLayout() {
  return (
    <Layout>
      <div className="w-[100%] bg-[rgba(0,0,0,0.2)] h-[100%]">
        <Navbar/>
          <div className="mt-16">
          <Outlet />
          </div>
      </div>
    </Layout>
  );
}

export default AdminLayout;
