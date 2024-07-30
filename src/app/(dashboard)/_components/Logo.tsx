import Image from "next/image";

const Logo = () => {
  return (
    <>
      <Image
        src={"./public/logo.svg"}
        height={32}
        width={32}
        alt="logo image"
      />
    </>
  );
};

export default Logo;
