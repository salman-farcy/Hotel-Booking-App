import { useNavigate, useSearchParams } from "react-router-dom";
import qs from "query-string";
/* eslint-disable react/prop-types */
const CategoryBox = ({ label, icon: Icon, selected }) => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const handleClick = () => {
    let instanQuary = {};
    if(params){
      instanQuary = qs.parse(params.toString());
    }
    
    const updatedQuery = { ...instanQuary, category: label };
    const url = qs.stringifyUrl({
      url: "/",
      query: updatedQuery,
    })
    navigate(url);
  }
    
  params.get("category");

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
