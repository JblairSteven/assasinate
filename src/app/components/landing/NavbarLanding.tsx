// components/Navbar.tsx
import Link from "next/link";
import React, { useState } from "react";
import { buyUrl, docsUrl, xUrl } from "../../constants/config";
import Image from "next/image";

interface NavbarProps {
  onSearch: (address: string) => void;
}

const NavbarLanding: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <>
      <div className="fixed top-0 w-screen right-0 flex flex-row items-start lg:items-stretch justify-between gap-0 z-20">
        <div className="flex flex-col gap-0 lg:gap-4 font-bold text-[10px] lg:text-[16px]">
          {/* <div className="button-nav-logo button-nav-white  !bg-[#6F71C3]">
          <Image
          src="/logo.png"
          alt="Assasinate"
          width={480}
          height={480}
          className="w-auto h-8 mix-blend-color-dodge "
          />
          </div> */}

          <div className="cut-corners-left-nav outer w-[13rem] md:w-[27rem] -translate-x-2  -translate-y-2 transition-all duration-200 hover:-translate-x-5 hover:brightness-125">
            <div className="cut-corners-left-nav inner">
              <Link
                href={buyUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-nav-responsive flex items-center justify-center w-full bg-[#161727] text-[#6F71C3]"
              >
                BUY $ASSASSIN
              </Link>
            </div>
          </div>
          <div className="cut-corners-left-nav outer w-[8rem] md:w-[21rem] -translate-x-2 transition-all duration-200 hover:-translate-x-5 hover:brightness-125">
            <div className="cut-corners-left-nav inner">
              <Link
                href={docsUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-nav-responsive flex items-center justify-center bg-[#6F71C3]"
              >
                DOCS
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-0 lg:gap-4 font-bold text-[10px] lg:text-[16px]">
          <div className="cut-corners-right-nav outer  w-[10rem] md:w-[15rem] translate-x-2  transition-all duration-200 hover:translate-x-5 hover:brightness-125 -translate-y-2">
            <div className="cut-corners-right-nav inner">
              <Link
                href={xUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-nav-responsive-right flex items-center justify-center w-full bg-[#161727]"
              >
                <Image
                  src="/x.png"
                  alt="x"
                  width={480}
                  height={480}
                  className="size-[18px] md:size-6"
                />
              </Link>
            </div>
          </div>
          <div className="cut-corners-right-nav outer w-[14rem] md:w-[20rem] translate-x-2   transition-all duration-200  hover:brightness-125 hover:translate-x-5">
            <div className="cut-corners-right-nav inner">
              <Link
                href={buyUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 px-[5rem] flex items-center justify-center bg-[#6F71C3]"
              >
                DEX
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed left-1/2 -translate-x-1/2 max-w-2xl mx-auto z-20 top-[25%] md:top-0 w-full flex flex-col gap-2 justify-center items-center">
        <div className="w-[10rem] hidden md:block">
          <Image
            src="/logo.png"
            alt="x"
            width={1000}
            height={1000}
            className="w-full"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className=" cut-corners-form outer w-full !text-white "
        >
          <div className="cut-corners-form inner flex items-stretch">
            <button
              type="submit"
              className="bg-[#9D9EE2] py-3 w-[25rem] text-[15px] text-nowrap cut-corners-btn relative"
            >
              <span className="z-[5] top-1/2  left-[30%] -translate-y-1/2 absolute">
                Search Address
              </span>
            </button>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pr-2 pl-10 text-white w-full border-none bg-[#6F71C3]  focus:outline-none placeholder-black placeholder-font-bold text-[15px] leading-6"
            />
            <button
              type="submit"
              className="bg-[#9D9EE2] py-3 pr-[4rem] pl-[1rem] h-[3rem] text-[15px] text-nowrap cut-corners-search relative transition-all duration-200  hover:brightness-125"
            >
              <svg
                className="z-[5] top-1/2  left-0 -translate-y-1/2 absolute h-[2rem]"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.2238 16.3733L22.9167 20.8857L21.367 22.3757L16.6742 17.8634C14.9868 19.1614 12.8469 19.938 10.5194 19.938C5.07563 19.938 0.657471 15.6897 0.657471 10.4553C0.657471 5.22089 5.07563 0.972656 10.5194 0.972656C15.9632 0.972656 20.3814 5.22089 20.3814 10.4553C20.3814 12.6932 19.5738 14.7509 18.2238 16.3733ZM16.0254 15.5915C17.3653 14.2638 18.1898 12.4526 18.1898 10.4553C18.1898 6.3804 14.7573 3.07991 10.5194 3.07991C6.28153 3.07991 2.84902 6.3804 2.84902 10.4553C2.84902 14.5302 6.28153 17.8307 10.5194 17.8307C12.5966 17.8307 14.4802 17.0379 15.8611 15.7495L16.0254 15.5915Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </form>

        <button className="transition-all duration-200  hover:brightness-125"
          onClick={() => {
            window.location.href = "/assasinate";
          }}
        >
          <Image
            src="opentheworld.svg"
            alt="x"
            width={1000}
            height={1000}
            className="w-[16rem] mt-6"
          />
        </button>
      </div>
    </>
  );
};
export default NavbarLanding;
