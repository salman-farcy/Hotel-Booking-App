import { useNavigate } from "react-router-dom";
import queryString from "query-string";
/* eslint-disable react/prop-types */
const CategoryBox = ({ label, icon: Icon, selected }) => {
  const navigate = useNavigate();
  console.log(selected)

  const handleClick = () => {
    let currentQuery = {category: label}
    const url = queryString.stringifyUrl({
      url: '/',
      query: currentQuery
    })
    navigate(url)
  }

  return (
    <div
      onClick={handleClick}
      className={`${selected ? "border-b-red-500 text-neutral-800" : ""} flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer `}
    >
      <Icon className={`${selected ? "text-red-500" : ""}`} size={26} />
      <div className="text-sm font-medium"> {label}</div>
    </div>
  );
};

export default CategoryBox;
