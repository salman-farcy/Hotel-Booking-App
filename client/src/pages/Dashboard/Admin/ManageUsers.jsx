import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Heading from "../../../components/Shared/Heading";
import UserDataRow from "../../../components/Dashboard/TableRows/UserDataRow";
import Loader from "../../../components/Shared/Loader";  

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch users Data
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users`);
      return data;
    },
  });

  if (isLoading) return <Loader />;
  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <Helmet>
          <title>Manage Users</title>
        </Helmet>
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="flex gap-4 px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm  font-normal"
                    >
                      Q:  {users && <p>T: {users?.length}</p>}
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users && users?.length > 0 ? ( 
                    users.map((user, i) => (
                      <UserDataRow
                        key={user?._id}
                        user={user}
                        i={i}
                        refetch={refetch}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">
                        <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
                          <Heading
                            center={true}
                            title="There are currently no users !"
                            subtitle="Please Arrange for user add."
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
