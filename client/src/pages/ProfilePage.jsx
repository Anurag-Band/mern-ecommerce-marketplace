import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <section className="min-h-[80vh]">
      <div className="container mx-auto px-5 xl:px-32">
        <h2 className="text-2xl md:text-5xl text-slate-500 font-semibold font-primary my-5 md:my-10">
          My Profile
        </h2>
        <div className="flex flex-col sm:flex-row items-center px-5 space-x-96">
          <div className="flex flex-col space-y-10 items-center">
            <div className="overflow-hidden rounded-full">
              <img
                src={user.photo.secure_url}
                alt={user.name}
                className="w-72 h-72 object-fill rounded-full"
              />
            </div>
            <Link
              to={"/me/update"}
              className="py-1 px-6 rounded-sm w-52 text-xl text-red-600 border border-red-500 hover:bg-red-200 active:bg-red-400 active:text-white cursor-pointer text-center"
            >
              Edit Profile
            </Link>
          </div>
          <div className="flex flex-col space-y-10">
            <div className="flex flex-col items-center space-y-3">
              <h3 className="text-lg md:text-xl font-semibold font-primary">
                Full Name
              </h3>
              <p className="text-base md:text-2xl font-secondary font-medium text-orange-500">
                {user.name}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <h3 className="text-lg md:text-xl font-semibold font-primary">
                Email
              </h3>
              <p className="text-base md:text-2xl font-secondary font-medium text-orange-500">
                {user.email}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <h3 className="text-lg md:text-xl font-semibold font-primary">
                Joined On
              </h3>
              <p className="text-base md:text-2xl font-secondary font-medium text-orange-500">
                {user.createdAt.substr(0, 10)}
              </p>
            </div>
            <button className="py-1 px-6 rounded-sm w-52 text-xl text-blue-600 border border-blue-500 hover:bg-blue-200 active:bg-blue-400 active:text-white cursor-pointer">
              My Orders
            </button>
            <button className="py-1 px-6 rounded-sm w-52 text-xl text-red-600 border border-red-500 hover:bg-red-200 active:bg-red-400 active:text-white cursor-pointer">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
