import { me } from "@/api/auth";
import { getCSSVariable } from "@/common";
import { IUser } from "@/context/auth.context";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

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
    <div className="w-full h-full flex items-center justify-center">
      <BarLoader
        color={getCSSVariable("primaryColor")}
        loading={true}
        width={120}
        cssOverride={{
          borderRadius: "10px",
        }}
        height={10}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
