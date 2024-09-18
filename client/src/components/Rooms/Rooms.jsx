import Card from "./Card";
import Container from "../Shared/Container";
import Heading from "../Shared/Heading";
import Loader from "../Shared/Loader";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Rooms = () => {
  const axiosSecure = useAxiosSecure()

  const { data: rooms=[], isLoading} = useQuery({
    queryKey: ['rooms'],
    queryFn: async ( )=> {
      const {data} = await axiosSecure.get('/rooms')
      return data;
    }
  })

  if (isLoading) return <Loader />;
  
  return (
    <Container>
      {rooms && rooms.length > 0 ? (
        <div className="pt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {rooms.map((room) => (
            <Card key={room._id} room={room} />
          ))}
        </div>
      ) : (
        <div className=" flex items-center justify-center min-h-[calc(100vh-300px)]">
          <Heading
            center={true}
            title="No Rooms Available In This Category!"
            subtitle="Please Select Other Categories."
          />
        </div>
      )}
    </Container>
  );
};

export default Rooms;
