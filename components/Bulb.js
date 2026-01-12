import Image from "next/image";

const Bulb = () => {
  return <div className="absolute left-0 bottom-0 rotate-12 mix-blend-color-dodge animate-pulze duration-75 z-10 z-[200px]" // Adjust these values to your desired position
    style={{ transform: 'translate(-70px, -200px)' }}>

    <Image src={"/bulb.png"} width={260} height={200} className="w-full h-full" alt='' />
  </div>;
};

export default Bulb;
