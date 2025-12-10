import { useEffect, useState } from "react";
import AOS from "aos";
import Hero from "../assets/object.svg";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

export default function WaveBackground() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });

    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  const getStarted = () => {
    navigate('/onboard');
  };

  return (
    <>
      <section
        id="home"
        className="relative w-full pt-20 sm:pt-20 md:pt-24 md:pb-10 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto max-md:px-6  h-full">
          <div className="w-full flex max-md:flex-col  items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-160px)]">

            {/* ====== Left Content ====== */}
            <div
              className="w-full md:w-1/2 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 flex flex-col justify-center order-1 md:order-1"
              data-aos="fade-right"
            >
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                Split Smarter,
                <br />
                Spend Together
              </h1>

              <p className="text-sm xs:text-base sm:text-lg md:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed tracking-wide max-w-full md:max-w-md lg:max-w-lg">
                CoSplitz helps you share expenses, organize group payments, and buy things together — whether you're a seller or just need people to split costs with.
              </p>

              {/* ====== Desktop Buttons ====== */}
              <div
                className="hidden md:flex flex-row gap-3 lg:gap-4 pt-2 md:pt-4 lg:pt-6 w-full"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                <button
                  onClick={getStarted}
                  className="px-5 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-4 bg-[#1F8225] text-white text-sm md:text-base lg:text-lg font-semibold rounded-md shadow-md hover:bg-[#17661C] active:scale-95 transition duration-300 flex-1 sm:flex-initial"
                >
                  Get Started
                </button>
                <button className="px-5 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-4 border-2 border-[#1F8225] text-[#1F8225] text-sm md:text-base lg:text-lg font-semibold rounded-md hover:bg-[#f0f9f0] active:scale-95 transition duration-300 flex-1 sm:flex-initial">
                  Learn More
                </button>
              </div>
            </div>

            {/* ====== Right Image ====== */}
            <div
              className="w-full md:w-1/2 flex justify-center md:justify-end order-2 md:order-2"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="relative w-full max-w-[320px] xs:max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1F8225]/10 to-transparent rounded-2xl blur-2xl -z-10" />
                <img
                  src={Hero}
                  alt="App illustration"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  draggable="false"
                />
              </div>
            </div>

            {/* ====== Mobile Buttons ====== */}
            <div
              className="flex md:hidden flex-col gap-3 sm:gap-4 pt-4 sm:pt-6 w-full order-3"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <button
                onClick={getStarted}
                className="px-6 py-3 sm:py-3.5 bg-[#1F8225] text-white text-base sm:text-lg font-semibold rounded-md shadow-md hover:bg-[#17661C] active:scale-95 transition duration-300 w-full"
              >
                Get Started
              </button>
              <button className="px-6 py-3 sm:py-3.5 border-2 border-[#1F8225] text-[#1F8225] text-base sm:text-lg font-semibold rounded-md hover:bg-[#f0f9f0] active:scale-95 transition duration-300 w-full">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}