import { me } from "@/api/auth";
import { IUser } from "@/context/auth.context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  accessToken: string;
  setUserAndRoute: (data: { user: IUser }, route: string) => void;
}

const Loader: React.FC<Props> = ({ setUserAndRoute }) => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      console.log("laoder");
      let [data, err] = await me();
      if (err) {
        navigate("/login");
        return;
      }
      setUserAndRoute(data!, "/");
    })();

    const timeout = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);

    return () => clearTimeout(timeout);
  }, [navigate, setUserAndRoute]);

  return (
    <div>
      <div>Loading...</div>
    </div>
  );
};

export default Loader;
