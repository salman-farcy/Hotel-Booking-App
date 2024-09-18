import { differenceInDays } from "date-fns";
import Button from "../../Button/Button";
import Calender from "./Calender";

const RoomReservation = ({ room }) => {
  const totalDay = differenceInDays(new Date(room?.to), new Date(room?.from));

  const totalPrice = totalDay * room?.price;
  return (
    <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-4">
        <div className="text-2xl font-semibold">${room?.price}</div>
        <div className="font-light text-neutral-600 ">Night</div>
      </div>
      <hr />

      <div className="flex justify-center">
        <Calender />
      </div>

      <hr />

      <div className="p-4">
        <Button label="Reserve" />
      </div>

      <hr />

      <div className="flex items-center justify-between font-semibold p-4 text-lg">
        <div className="">Total:</div>
        <div className="">${totalPrice}</div>
      </div>
    </div>
  );
};

export default RoomReservation;
