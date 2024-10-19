import { BsFingerprint } from "react-icons/bs";
import { GrUserAdmin } from "react-icons/gr";
import MenuItem from ".//MenuItem";
import useRole from "../../../../hooks/useRole";
import HostModal from "../../../Modal/HostModal";
import { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import { BecomeAHostmodalHandler } from "../../../../hooks/ReUseFunction/BecomeAHost";

const GuestMenu = () => {
  const [role] = useRole();
  const axiosSecure = useAxiosSecure();
  const { user, logOut } = useAuth();

  // for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <MenuItem
        icon={BsFingerprint}
        label="My Bookings"
        address="my-bookings"
      />

      {role === "guest" && (
        <div onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer">
          <GrUserAdmin className="w-5 h-5" />
          <span className="mx-4 font-medium">Become A Host</span>
        </div>
      )}
      {/* Modal  */}
      <HostModal
        modalHandler={()=> BecomeAHostmodalHandler(user, axiosSecure, closeModal)}
        closeModal={closeModal}
        isOpen={isModalOpen}
      />
    </>
  );
};

export default GuestMenu;
