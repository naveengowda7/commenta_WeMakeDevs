import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Youtube, Home, Video, LogOut, Menu, X } from "lucide-react";
import React from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/home")}
            >
              <Youtube className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Commenta
              </span>
            </div>

            <div className="hidden md:flex gap-2">
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </button>
              <button
                onClick={() => navigate("/videos")}
                className="px-4 py-2 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Videos
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.channelName}</span>
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                {user?.channelName?.[0] || "U"}
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => {
                navigate("/home");
                setMenuOpen(false);
              }}
              className="w-full text-left py-2 hover:bg-gray-100 rounded"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/videos");
                setMenuOpen(false);
              }}
              className="w-full text-left py-2 hover:bg-gray-100 rounded"
            >
              Videos
            </button>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full text-left py-2 text-red-600 hover:bg-gray-100 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
