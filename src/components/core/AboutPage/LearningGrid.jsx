import React from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "Key Highlights of ",
    highlightText: "MutaLearn",
    description:
      "MutaLearn offers a range of features designed to enhance the academic journey of students. With a focus on collaboration and ease of use, we provide a comprehensive set of tools to facilitate effective learning.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "User Profiles",
    description:
      "Each student has a profile where they can manage their uploaded videos, track their viewing history, and personalize their learning experience.",
  },
  {
    order: 2,
    heading: "Rating and Review",
    description:
      "Videos can be rated by users, helping others identify the most helpful content",
  },
  {
    order: 3,
    heading: "Mobile Responsiveness",
    description:
      "The website is fully responsive, providing a seamless experience across all devices, including smartphones and tablets.",
  },
  {
    order: 4,
    heading: "Categorized Content",
    description:
      "Videos are organized into categories based on subjects and topics, making it easy for students to find relevant content quickly.",
  },
  {
    order: 5,
    heading: "Upload Video and Notes",
    description:
      "User can sign up as instructor and can upload Lecture, notes , assignment and many more.",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 && "xl:col-span-2 xl:h-[294px]"}  ${
              card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                ? "bg-richblack-1000 h-[294px]"
                : "bg-transparent"
            } ${card.order === 3 && "xl:col-start-2"}  `}
          >
            {card.order < 0 ? (
              <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
