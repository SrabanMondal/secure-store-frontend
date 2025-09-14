"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trash2, Users } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Trash", href: "/dashboard/trash", icon: Trash2 },
    { name: "Workers", href: "/dashboard/worker", icon: Users },
  ];

  return (
    <div className="w-60 bg-white shadow-lg flex flex-col p-4">
      {/* Brand */}
      <h1 className="text-2xl font-bold mb-8 text-blue-600">Secure Store</h1>

      {/* Navigation */}
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="mt-auto pt-6 text-sm text-gray-400">
        v1.0.0
      </div>
    </div>
  );
};

export default Sidebar;
