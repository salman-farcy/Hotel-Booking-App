import useRole from "../../../hooks/useRole";
import AdminStatistics from "../Admin/AdminStatistics";
import HostStatistics from "../Host/HostStatistics";
import GuestStatistics from "../Guest/GuestStatistics";
import Loader from "../../../components/Shared/Loader";

const Statistice = () => {
  const [role, isLoading] = useRole();
   

  if (isLoading) return <Loader />;
  return (
    <>
      {role === "admin" && <AdminStatistics />}
      {role === "host" && <HostStatistics />}
      {role === "guest" && <GuestStatistics />}
    </>
  );
};

export default Statistice;
