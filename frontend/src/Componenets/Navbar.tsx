// components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Routes", path: "/routes" },
    { name: "Compare", path: "/compare" },
    { name: "Banking", path: "/banking" },
    { name: "Pooling", path: "/pooling" },
  ];

  return (
    <nav className="bg-white shadow-md py-3 px-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">FuelEU Maritime</h1>
      <ul className="flex gap-6">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`font-medium hover:text-blue-600 ${
                location.pathname === item.path ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
