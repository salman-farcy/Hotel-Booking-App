import PropTypes from "prop-types";
import UpdateUserModal from "../../Modal/UpdateUserModal";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
const UserDataRow = ({ user, i, refetch }) => {
  const [isOpen, setIsOpen] = useState(false)
  const axiosSecure = useAxiosSecure()

  // user role Update Using useMutation
  const {mutateAsync} = useMutation({
    mutationFn: async (user) => {
      const {data} = await axiosSecure.patch(`/users/update/${user?.email}`, user)
      return data
    }, 
    onSuccess: () => {
      refetch()
      toast.success("Update User Role")
      setIsOpen(false)
    }
  })

   //   Modal handler 
   const modalHandler = async (selected, email) => {
    const user = {
      email: email,
      role: selected,
      status: "verified"
    }
    
    try{
      await mutateAsync(user) 
    }catch(err){
      console.log(err.message)
    }

   }

  return (
    <tr>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{i + 1} </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{user?.email}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div
          className={`${
            user?.role === "admin" ? "bg-green-400" : user?.role === "host" ? "bg-yellow-300" : "bg-red-300"
          } h-6 w-16 flex items-center justify-center rounded-xl text-sm`}
        >
          <p className="text-gray-900 whitespace-no-wrap">{user?.role}</p>
        </div>  
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {user?.status ? (
          <p
            className={`${
              user?.status === "verified" ? "text-green-500" : "text-yellow-500"
            } whitespace-no-wrap`}
          >
            {user?.status}
          </p>
        ) : (
          <p className="text-red-500 whitespace-no-wrap">Unavailable</p>
        )}
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span onClick={() => setIsOpen(true)} className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">Update Role</span>
        </span>
        {/* Update User Modal */}
      <UpdateUserModal modalHandler={modalHandler} setIsOpen={setIsOpen} isOpen={isOpen} user={user} />
      </td>
    </tr>
  );
};

UserDataRow.propTypes = {
  user: PropTypes.object,
  refetch: PropTypes.func,
};

export default UserDataRow;
