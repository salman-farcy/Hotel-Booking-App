import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import avatarImg from "../../../assets/images/placeholder.jpg";
import HostModal from "../../Modal/HostModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";
import { BecomeAHostmodalHandler } from "../../../hooks/ReUseFunction/BecomeAHost";

const MenuDropdown = () => {
  const axiosSecure = useAxiosSecure();

  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useAuth();
  const [role, isLoading] = useRole();

  // for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {/* Become A Host btn */}

        <div onClick={() => setIsModalOpen(true)} className="hidden md:block">
          {user && role === "guest" && (
            <button className="disabled:cursor-not-allowed cursor-pointer hover:bg-neutral-100 py-3 px-4 text-sm font-semibold rounded-full  transition">
              Host your home
            </button>
          )}
        </div>

        {/* Modal  */}
        <HostModal
          modalHandler={() =>
            BecomeAHostmodalHandler(user, axiosSecure, closeModal)
          }
          closeModal={closeModal}
          isOpen={isModalOpen}
        />

        {/* Dropdown btn */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            {/* Avatar */}
            <img
              className="rounded-full"
              referrerPolicy="no-referrer"
              src={user && user.photoURL ? user.photoURL : avatarImg}
              alt="profile"
              height="30"
              width="30"
            />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-white overflow-hidden right-0 top-12 text-sm">
          {user ? (
            <div className="flex flex-col cursor-pointer">
              <Link
                to="/"
                className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                onClick={() => setIsOpen(!isOpen)}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
              >
                Dashboard
              </Link>
              <div className="bg-red-400 text-center py-3 text-white font-semibold cursor-pointer">
                <button onClick={() => logOut()}>LogOut</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col cursor-pointer">
              <Link
                to="/"
                className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                onClick={() => setIsOpen(!isOpen)}
              >
                Home
              </Link>
              <Link
                to="/login"
                className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
