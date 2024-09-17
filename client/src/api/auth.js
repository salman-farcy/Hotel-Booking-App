
import axiosSecure from "."

export const saveUser = async user =>{
   const currentUser = {
      eamil: user.email,
      role: 'guest', 
      status: 'Varified',
   }

   const { data } = await axiosSecure.put(`/users/${user?.email}`, currentUser)

   return data
}