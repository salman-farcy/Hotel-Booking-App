import toast from "react-hot-toast";

//Become A Host modalHandler
export const BecomeAHostmodalHandler = async (user, axiosSecure, closeModal) => {
     try {
       const currentUser = {
         email: user?.email,
         role: "guest",
         status: "Requested",
       };
       const { data } = await axiosSecure.put(`/user`, currentUser);
   
       if (data.modifiedCount > 0) {
         toast.success("Success! your host request Please wait for admin approval", {
           icon: "🥳",
         })
       } else {
         toast.success("Please wait for admin approval!", { icon: "🧐" });
       }
   
     } catch (err) {
       toast.error(err.message);
     }finally{
   
       closeModal();
     }
   };