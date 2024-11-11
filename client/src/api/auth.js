import axiosSecure from ".";

export const saveUser = async (user) => {
  const currentUser = {
    eamil: user.email,
    role: "guest",
    status: "varified",
  };
  const { data } = await axiosSecure.put(`/users/${user}`, currentUser);
  return data;
};
