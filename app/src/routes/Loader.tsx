import { me } from "@/api/auth";
import { IUser } from "@/context/auth.context";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setUserAndRoute: (data: { user: IUser }, route: string) => void;
}

const Loader: React.FC<Props> = ({ setUserAndRoute }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);

    (async () => {
      let [data, err] = await me();
      if (err) {
        navigate("/login");
        return;
      }
      clearTimeout(timeout);
      setUserAndRoute(data!, pathname);
    })();

    return () => clearTimeout(timeout);
  }, [navigate, setUserAndRoute]);

  return (
    <div>
      <div>Loading...</div>
    </div>
  );
};

export default Loader;
