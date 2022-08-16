import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import MobileLogo from "../../assets/logo-mobile.png";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Navigation = () => {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto p-2 px-5 lg:px-16 flex items-center justify-between space-x-2 mb-1">
        <Link to="/">
          <img src={Logo} alt="cash N carry" className="hidden lg:block w-60" />
          <img
            src={MobileLogo}
            alt="cash N carry"
            className="block lg:hidden w-12"
          />
        </Link>
        <label
          htmlFor="searchProduct"
          className="relative hidden sm:flex items-center lg:w-96"
        >
          <SearchIcon className="absolute left-2 text-slate-400" />
          <input
            type="text"
            placeholder="search by product, category or collection"
            name="searchProduct"
            className="px-10 py-3 focus:border focus:border-black bg-gray-200 focus:bg-white focus:ring-1 focus:ring-slate-500 text-slate-600 border-none text-sm rounded-sm w-full transition-all delay-100"
          />
        </label>
        <div className="flex items-center space-x-7">
          <AddShoppingCartIcon className="cursor-pointer" />
          <FavoriteBorderIcon className="cursor-pointer" />
          <Link
            to={"/products"}
            className="cursor-pointer font-semibold text-lg animate-bounce text-red-500"
          >
            Shop
          </Link>
          <Link to={"/"} className="cursor-pointer font-semibold text-lg">
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
