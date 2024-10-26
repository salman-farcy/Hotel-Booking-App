import { useMutation, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Shared/Loader";
import RoomDataRow from "../../../components/Dashboard/TableRows/RoomDataRow";
import Heading from "../../../components/Shared/Heading";
import toast from "react-hot-toast";

const MyListings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: rooms = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-listings", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/my-listings/${user?.email}`);
      return data;
    },
  });


  // Delete
  const { mutateAsync } = useMutation({
    mutationFn: async (id) => {
      const {data} = await axiosSecure.delete(`/room/${id}`)
      return data 
    },
    onSuccess: data => {
      console.log(data)  
      refetch()
      toast.success("successfully deleted.")
    }
  })

  // Handel Delete
  const handleDelete = async (id) => {
    try{
      await mutateAsync(id)
    }catch(err){
      toast.error(err.message)
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Helmet>
        <title>My Listings</title>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      To
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Delete
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                    >
                      Update
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rooms && rooms.length > 0 ? (
                    rooms.map((room) => (
                      <RoomDataRow
                        key={room._id}
                        room={room}
                        handleDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">
                        <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
                          <Heading
                            center={true}
                            title="You haven't added any rooms yet!"
                            subtitle="Please add your room."
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

export default MyListings;
