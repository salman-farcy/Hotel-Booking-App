import { differenceInDays } from "date-fns";
import Button from "../../Button/Button";
// import Calender from "./Calender";
import { useState } from "react";
import { DateRange } from "react-date-range";
import BookingModal from "../../Modal/BookingModal";
import useAuth from "../../../hooks/useAuth";

const RoomReservation = ({ room, refetch }) => {
  const {user} = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(room.from),
      endDate: new Date(room.to),
      key: "selection",
    },
  ]);
  const totalDay = differenceInDays(new Date(room?.to), new Date(room?.from));
  const totalPrice = totalDay * room?.price;
  
  const closeModal = () => {
    setIsOpen(false)
  };

  return (  
    <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-4">
        <div className="text-2xl font-semibold">${room?.price}</div>
        <div className="font-light text-neutral-600 ">Night</div>
      </div>
      <hr />

      <div className="flex justify-center">
        {/* <Calender /> */}
        <DateRange
          showDateDisplay={false}
          rangeColors={["#F6536D"]}
          onChange={(item) => {
            setState([
              {
                startDate: new Date(room.from),
                endDate: new Date(room.to),
                key: "selection",
              },
            ]);
          }}
          moveRangeOnFirstSelection={false}
          ranges={state}
        />
      </div>

      <hr />

      <div className="p-4">
        <Button disabled={room?.booked === true}  onClick={()=> setIsOpen(true)} label={room?.booked === true? "Booked" : "Reserve"} />
      </div>
      {/* Modal */}
      <BookingModal refetch={refetch} closeModal={closeModal} isOpen={isOpen} bookingInfo={{...room, price:totalPrice, guest: {name: user?.displayName, email: user?.email, image: user?.photoURL}}}/>
      <hr />

      <div className="flex items-center justify-between font-semibold p-4 text-lg">
        <div className="">Total:</div>
        <div className="">${totalPrice}</div>
      </div>
    </div>
  );
};

export default RoomReservation;
