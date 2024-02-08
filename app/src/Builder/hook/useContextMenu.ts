import { useEffect, useState } from "react";

interface ContextData {
  [key: string]: any;
}

export const useContextMenu = () => {
  // boolean value to determine if the user has right clicked
  const [clicked, setClicked] = useState(false);
  const [contextData, setContextData] = useState<ContextData>({});
  // allows us to track the x,y coordinates of the users right click
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    // reset clicked to false on user click
    const handleClick = () => {
      setClicked(false);
    };

    // add listener for user click
    document.addEventListener("click", handleClick);

    // clean up listener function to avoid memory leaks
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    console.log("contextmenu:", clicked, contextData);
  }, [clicked, contextData]);

  return {
    clicked,
    setClicked,
    coords,
    setCoords,
    contextData,
    setContextData,
  };
};
