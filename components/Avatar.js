import React, { useState, useEffect } from "react";
import Image from "next/image";

const Avatar = () => {
  const [currentImage, setCurrentImage] = useState("/av1-removebg.png");
  const imageList = [
    "/av1-removebg.png",
    "/achrafzarouki-removebg.png",
    "/av2-removebg.png", // Add your image paths here
  ]; 

  useEffect(() => {
    // Use setInterval to switch the image every 5 seconds (5000 milliseconds)
    const interval = setInterval(() => {
      const currentIndex = imageList.indexOf(currentImage);
      const nextIndex = (currentIndex + 1) % imageList.length;
      setCurrentImage(imageList[nextIndex]);
    }, 800);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [currentImage]); // useEffect dependency on currentImage

  return (
    <div className="hidden xl:flex xl:max-w-none">
      <Image
        src={currentImage}
        width={737}
        height={678}
        alt=""
        className="translate-z-0 w-full h-full"
      />
    </div>
  );
};

export default Avatar;
