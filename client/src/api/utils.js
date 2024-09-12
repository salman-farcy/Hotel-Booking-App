import axios from "axios";

export const imgUploadImgbb = async (image) => {
  //* imgBB has to send image in FormData format so we put image in FormData
  const fromData = new FormData();
  fromData.append("image", image);

  //* Uploaded images to imgBB using axios
  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    fromData
  );
  return data;
};
