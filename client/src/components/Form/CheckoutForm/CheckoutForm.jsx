import PropTypes from "prop-types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import "./CheckoutForm.css";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { ImSpinner9 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CheckoutForm = ({ closeModal, bookingInfo, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState();
  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (bookingInfo?.price && bookingInfo?.price > 1) {
      // fetch client secret
      getClientSecret({ price: bookingInfo?.price });
    }
  }, [bookingInfo?.price]);

  // get clientSecret
  const getClientSecret = async (price) => {
    const { data } = await axiosSecure.post("/create-payment-intent", price);
    console.log("Client Secret From server", data);
    setClientSecret(data.clientSecret);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setCardError(error.message);
      setProcessing(false);
      return;
    } else {
      setCardError("");
    }

    // Confirm Payment
    const { error: confirmError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email,
            name: user?.displayName,
          },
        },
      });

    if (confirmError) {
      console.log(confirmError);
      setCardError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // console.log(paymentInfo);
      //1.Create Payment info object
      const paymentInfo = {
        ...bookingInfo,
        roomId: bookingInfo._id,
        transactionId: paymentIntent.id,
        date: new Date(),
      };
      delete paymentInfo._id;
      try {
        //2. Save Payment Info in booking collection (db)
        await axiosSecure.post("/booking", paymentInfo);
        //3. Chabge room status to booked in db
        await axiosSecure.patch(`/room/status/${bookingInfo?._id}`, {status: true});
        // Update UI
        refetch()
        closeModal()
        toast.success("🥳 Room Booked Successfully")
        navigate("/dashboard/my-bookings")
      } catch (err) {
        console.log(err);
      }
    }
    setProcessing(false);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <div className="flex mt-2 justify-around">
          <button
            type="submit"
            disabled={!stripe || !clientSecret || processing}
            className="inline-flex justify-center rounded-md border border-transparent  bg-green-100 px-4 py-1"
          >
            {processing ? (
              <ImSpinner9 className="animate-spin m-auto" size={22} />
            ) : (
              `Pay - ${bookingInfo?.price}`
            )}
          </button>

          <button
            onClick={closeModal}
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-1"
          >
            Cancel
          </button>
        </div>
      </form>
      {cardError && <p className="text-red-400">{cardError}</p>}
    </>
  );
};
CheckoutForm.propTypes = {
  bookingInfo: PropTypes.object,
  closeModal: PropTypes.func,
};
export default CheckoutForm;
