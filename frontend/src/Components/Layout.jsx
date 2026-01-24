function Layout({ children }) {
  return (
    <div className="bg-[url(/bg.png)] bg-cover bg-center h-screen w-screen flex flex-col items-center justify-center">
      {children}
    </div>
  );
}

export default Layout;
