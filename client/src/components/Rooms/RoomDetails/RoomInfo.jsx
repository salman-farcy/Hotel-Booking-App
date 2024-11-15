const RoomInfo = ({ room }) => {
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
              text-xl 
              font-semibold 
              flex 
              flex-row 
              items-center
              gap-2
            "
        >
          <div>Hosted by {room?.host?.name}</div>

          <img
            className="rounded-full"
            height="30"
            width="30"
            alt="Avatar"
            referrerPolicy="no-referrer"
            src={room?.host?.image}
          />
        </div>
        <div
          className="
              flex 
              flex-row 
              items-center 
              gap-4 
              font-light
              text-neutral-500
            "
        >
          <div>Guests-{room?.guests}</div>
          <div>Bedrooms-{room?.bedrooms}</div>
          <div>Bathrooms-{room?.bathrooms}</div>
        </div>

        <div className="">
          {room?.booked && (
            <span className="bg-red-400 text-white px-3 rounded-xl">
              Booked
            </span>
          )}
        </div>
      </div>

      <hr />

      <div
        className="
        text-lg font-light text-neutral-500"
      >
        {room?.description}
      </div>
      <hr />
    </div>
  );
};

export default RoomInfo;
