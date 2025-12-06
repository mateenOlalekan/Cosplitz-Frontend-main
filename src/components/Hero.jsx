import { useEffect} from "react";
import AOS from "aos";
import Hero from "../assets/object.svg";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

export default function WaveBackground() {
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

  const navigate = useNavigate()

  const getStarted=()=>{
    navigate('/onboard')
  }

  return (
    <>

      <section
        id="home"
        className="relative w-full  pt-24 md:pt-24 bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto flex  px-4  h-full">
          <div className="w-full flex max-md:flex-col  items-center justify-between gap-2 md:gap-8 lg:gap-10 min-h-[calc(100vh-200px)] md:min-h-[calc(100vh-160px)]">

            {/* ====== Left Content ====== */}
            <div
              className="w-full md:w-1/2 space-y-3 md:space-y-4 flex flex-col justify-center"
              data-aos="fade-right"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl  font-bold text-gray-900 leading-tight tracking-tight">
                Split Smarter,
                <br/>
                Spend Together
              </h1>

              <p className="text-base sm:text-[36] md:text-lg text-gray-600 leading-relaxed tracking-wide max-w-md">
                CoSplitz helps you share expenses, organize group payments, and buy things together — whether you're a seller or just need people to split costs with.
              </p>

              {/* ====== Buttons ====== */}
              <div
                className="hidden md:flex flex-col sm:flex-row gap-4 pt-4 md:pt-6 w-full sm:w-auto"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                <button onClick={getStarted} className="px-6 sm:px-8 py-3 md:py-4 bg-[#1F8225] text-white font-semibold rounded-md shadow-md hover:bg-[#17661C] active:scale-95 transition duration-300 w-full sm:w-auto">
                  Get Started
                </button>
                <button className="px-6 sm:px-8 py-3 md:py-4 border-2 border-[#1F8225] text-[#1F8225] font-semibold rounded-md hover:bg-[#f0f9f0] active:scale-95 transition duration-300 w-full sm:w-auto">
                  Learn More
                </button>
              </div>
            </div>

            {/* ====== Right Image ====== */}
            <div
              className="w-full md:w-1/2 flex justify-center md:justify-end"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="relative w-full max-w-sm pt sm:max-w-sm md:max-w-lg lg:max-w-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1F8225]/10 to-transparent rounded-2xl blur-2xl -z-10" />
                <img
                  src={Hero}
                  alt="App illustration"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  draggable="false"
                  
                />
              </div>
            </div>

              {/* ====== Buttons ====== */}
              <div
                className="hidden max-md:flex  max-md:flex-col gap-4 pt-8 w-full sm:w-auto"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <button className="px-6 sm:px-8 py-3 md:py-4 bg-[#1F8225] text-white font-semibold rounded-md shadow-md hover:bg-[#17661C] active:scale-95 transition duration-300 w-full sm:w-auto">
                  Get Started
                </button>
                <button className="px-6 sm:px-8 py-3 md:py-4 border-2 border-[#1F8225] text-[#1F8225] font-semibold rounded-md hover:bg-[#f0f9f0] active:scale-95 transition duration-300 w-full sm:w-auto">
                  Learn More
                </button>
              </div>
            
          </div>
        </div>
      </section>
    </>
  );
}