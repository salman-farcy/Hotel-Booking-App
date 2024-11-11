import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { imgUploadImgbb } from "../../../api/utils";
import { Helmet } from 'react-helmet-async'
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";


const AddRoom = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState();
  const [imageText, setImageText] = useState("Upload Image")


  const [datas, setDatas] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  // Date range handler
  const handleDates = (item) => {
    setDatas(item?.selection);
  };

  const {mutateAsync} = useMutation({
    mutationFn: async roomData => {
      const { data } = await axiosSecure.post('/room', roomData)
      return data
    },
    onSuccess: () => {
      toast.success("Room Add Success")
      setLoading(false)  
      navigate('/dashboard/my-listings')
    }
    
  })

  // From Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true)

    const form = e.target;
    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
    const to = datas.endDate;
    const from = datas.startDate;
    const image = form.image.files[0];
    const price = form.price.value;
    const guests = form.totalGuest.value;
    const bathrooms = form.bathrooms.value;
    const bedrooms = form.bedrooms.value;
    const description = form.description.value;

    // Hist dtails
    const host = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    }; 

    try {
      // image uploding
      const image_url = await imgUploadImgbb(image);
      const roomData = {
        location,
        category,
        title,
        to,
        from,
        price,
        guests,
        bathrooms,
        host,
        description,
        bedrooms,
        image: image_url,
      };

      // Post request to servcer
       await mutateAsync(roomData)
       
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  };


  // handel UI show imge change 
  const handelImage = image =>{
    setImagePreview(URL.createObjectURL(image))
    setImageText(image?.name)
  }

  return (
    <div>
      <Helmet>
        <title>Add Room | Dashboard</title>
      </Helmet>

      {/* form */}
      <AddRoomForm
        handleSubmit={handleSubmit}
        handleDates={handleDates}
        datas={datas}
        handelImage={handelImage}
        imagePreview={imagePreview}
        imageText={imageText}
        loading={loading}
      />
    </div>
  );
};

export default AddRoom;
