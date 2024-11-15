import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const Card = ({ room }) => {
  return (
    <Link to={`/room/${room?._id}`} className="col-span-1 cursor-pointer group">
      <div className="flex flex-col  w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-md">
          <img
            className="object-cover h-full w-full group-hover:scale-105 transition"
            src={room?.image}
            alt="Room"
          />
          <div className=" absolute top-3 right-3"></div>
        </div>

        <div className="font-semibold text-lg">{room?.location}</div>
        <div className="">
          {room?.booked && (
            <span className="bg-red-400 text-white px-3 rounded-xl">Booked</span>
          )}
        </div>
        <div className="font-light text-neutral-500">5 nights .</div>

        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">$ {room?.price}</div>
          <div className="font-light">night</div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
