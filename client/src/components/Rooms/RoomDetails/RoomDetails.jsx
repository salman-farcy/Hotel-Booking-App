import Container from "../../Shared/Container";
import { useParams } from "react-router-dom";
import Loader from "../../Shared/Loader";
import { Helmet } from "react-helmet-async";
import Header from "./Header";
import RoomInfo from "./RoomInfo";
import RoomReservation from "./RoomReservation";
import { useQuery } from "@tanstack/react-query";
import useAxiosCommon from "../../../hooks/useAxiosCommon";

const RoomDetails = () => {
  const { id } = useParams();
  const axiosCommon = useAxiosCommon();
  

  const { data: room = {}, isLoading, refetch } = useQuery({
    queryKey: ["room", id],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/room/${id}`);
      return data;
    }
  });

  if (isLoading) return <Loader />;

  return (
    <Container>
      <Helmet>
        <title>{room?.title}</title>
      </Helmet>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <Header room={room} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
          <RoomInfo room={room} />
        
          {/* Calender/ RoomReservation */}
          <div className="col-span-3 order-first md:order-last">
            <RoomReservation refetch={refetch} room={room} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RoomDetails;
