import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import developerimage from "../assets/Images/developerimage.png";
import homess from "../assets/Images/homess.png";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import Quote from "../components/core/AboutPage/Quote";
import HighlightText from "../components/core/HomePage/HighlightText";
import Footer from "../components/common/Footer";
import lnmiit from "../assets/Images/lnmiit.jpg";
import { FaEnvelope, FaGithub, FaLinkedin} from "react-icons/fa";


const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
    AOS.refresh();
  }, []);
  return (
    <div className="bg-richblack-800">
      <div className="h-20"></div>
      <section className="bg-richblack-800"></section>

      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[50%] flex-col gap-10">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our journey began with a simple yet profound mission: to enhance
                exam preparation and academic support for students at LNMIIT. As
                we navigated the demands and pressures of exam times, we
                recognized a common challenge among our peers— the need for
                accessible, peer-driven educational resources. In response, we
                envisioned a platform designed specifically for our university
                community. We wanted to create a space where students could
                share their insights and knowledge through video content,
                helping one another understand complex topics and excel in their
                studies.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our platform allows any LNMIIT student to upload videos
                explaining various lectures and topics, creating a rich
                repository of resources tailored to our unique curriculum. By
                fostering collaboration and peer-to-peer teaching, we aim to
                support each student's learning journey and make exam
                preparation more effective and engaging. Our mission is to
                bridge the gap between individual learning needs and the
                collective knowledge within our university, empowering every
                student to succeed and thrive.
              </p>
            </div>

            <div className="w-[50%]">
              <img
                src={lnmiit}
                alt=""
                className="shadow-[0_0_20px_0]  rounded-3xl h-full w-full "
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 justify-between lg:flex-row ">
            <div className="my-24 flex lg:w-[40%] flex-col gap-1">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Meet the Developer
              </h1>

              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] "></h1>
              <h1 className="text-white font-bold text-3xl mt-3">
                <HighlightText text={"Agam Swarup"} />
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Pursuing Bachelor of Technology (B.Tech) degree in Electronics
                and Communication at LNMIIT, Jaipur, with a keen interest and
                proficiency in MERN stack development. Dedication to both
                academic studies and development skills demonstrates ambition to
                excel in both hardware and software domains. As a MERN stack
                developer, possesses the ability to create dynamic and efficient
                web applications using MongoDB, Express.js, React.js, and
                Node.js. Commitment to learning and advancing skills reflects
                passion for technology and drive to succeed in the ever-evolving
                field of web development. Keep up the excellent work!
              </p>
              <div className="  bg-opacity-0 bg-richblack-1000 ml-0 rounded-3xl w-1/2 h-10 flex items-center justify-between gap-0 mt-5">
                <a
                  href="http://www.linkedin.com/in/agam-swarup-b82aa0217"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="text-white w-8 h-8 hover:bg-blue-200   " />
                </a>

                <a
                  href="https://github.com/AgamSwarup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="text-white w-8 rounded-full  h-8  hover:bg-black" />
                </a>

                <a
                  href="agamsuthar1003@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaEnvelope className="text-white w-8 h-8 rounded-sm pt-0 pb-0 hover:bg-pink-1000" />
                </a>
              </div>
            </div>
            <div className="w-1/2">
              <img
                src={developerimage}
                alt=""
                className="shadow-[#1FA2FF]  rounded-3xl h-1/2  "
              />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
        <LearningGrid />
      </section>

      <section className="border-b border-richblack-700">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="h-[100px] "></div>
        </div>
      </section>

      {/* <Footer /> */}
      <Footer />
    </div>
  );
};

export default About;
