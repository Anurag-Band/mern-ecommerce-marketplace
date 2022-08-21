import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import MobileLogo from "../../assets/logo-mobile.png";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, logoutUser } from "../../features/auth/authSlice";
import { STATUSES } from "../../utils/STATUSES";
import { unwrapResult } from "@reduxjs/toolkit";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, status } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products/${search}`);
    } else {
      navigate(`/products`);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser())
      .then(unwrapResult)
      .then((obj) => {
        console.log({ logoutThen: obj });
        navigate("/");
      })
      .catch((obj) => console.log({ logoutCatch: obj }));
  };

  useEffect(() => {
    if (status === STATUSES.ERROR) {
      setTimeout(() => dispatch(clearErrors()), 3000);
    }
  }, [dispatch, status]);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto p-1 px-5 lg:px-16 flex items-center justify-between space-x-2 mb-1">
        <Link to="/">
          <img src={Logo} alt="cash N carry" className="hidden lg:block w-60" />
          <img
            src={MobileLogo}
            alt="cash N carry"
            className="block lg:hidden w-12"
          />
        </Link>
        <form onSubmit={handleSearchSubmit}>
          <label className="relative hidden sm:flex items-center lg:w-96">
            <SearchIcon className="absolute left-2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search by product, category or collection"
              className="px-10 py-3 focus:border focus:border-black bg-gray-200 focus:bg-white focus:ring-1 focus:ring-slate-500 text-slate-600 border-none text-sm rounded-sm w-full transition-all delay-100"
            />
          </label>
        </form>
        <div className="flex items-center space-x-7">
          <AddShoppingCartIcon className="cursor-pointer" />
          <FavoriteBorderIcon className="cursor-pointer" />
          <Link
            to={"/products"}
            className="cursor-pointer font-semibold text-lg animate-bounce text-red-500"
          >
            Shop
          </Link>
          {isAuthenticated ? (
            <div className="relative flex items-center justify-center">
              <button className="peer">
                <div className="flex items-center justify-center w-14 h-14 rounded-full overflow-hidden">
                  <img
                    src={user.photo.secure_url}
                    alt={user.name}
                    className="object-fill"
                  />
                </div>
              </button>

              <div className="hidden peer-hover:flex peer-hover:flex-col hover:flex hover:flex-col w-[150px] flex-col bg-white drop-shadow-lg absolute top-9 right-5 text-md font-medium rounded-md">
                <Link
                  to={"/account"}
                  className="px-5 py-2 hover:bg-gray-200 cursor-pointer text-center"
                >
                  My Profile
                </Link>
                <Link
                  to={"/account"}
                  className="px-5 py-2 hover:bg-gray-200 cursor-pointer text-center"
                >
                  My Orders
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-5 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to={"/auth/login"}
              className="cursor-pointer font-semibold text-lg"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
