import React from "react";

const CourseCard = ({cardData, setCurrentCard}) => {
  return (
    <div
      className={` rounded-lg  w-[360px] lg:w-[30%] bg-richblack-800 text-richblack-25 h-[330px]  p-2 box-border cursor-pointer transform transition-transform duration-900 ease-in-out hover:scale-105 hover:bg-white hover:shadow-[8px_8px_0_0] border-20  hover:shadow-yellow-50 hover:text-richblack-800`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      <div className={`m-2 font-semibold text-[20px]`}>{cardData?.heading}</div>
      <div className={`m-2  text-richblack-400 font-medium text-[12px]`}>
        {cardData?.description}
      </div>

      <div className="text-richblack-400 h-full">
        <img
          className="  rounded-md  w-full h-3/4  mt-4"
          src={cardData?.img}
          alt="Image"
        />
      </div>
    </div>
  );
};

export default CourseCard;