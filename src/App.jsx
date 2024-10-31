import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Routers from "./routes/Routers";
import LoginRoutes from "./routes/LoginRoutes";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { data: token } = useQuery({
    queryKey: ["token"],
    queryFn: () => {
      const token = JSON.parse(localStorage.getItem("token"));
      return token;
    },
    staleTime: 1000 * 60 * 10,
  });
  if (token) {
    return (
      <div className="py-6 px-8 flex items-start h-screen">
        <Navbar />
        <div className="px-[72px] w-full h-full">
          <Routers />
        </div>
      </div>
    );
  } else {
    return <LoginRoutes />;
  }
}

export default App;
