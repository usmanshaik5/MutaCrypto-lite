import React from "react";
import Course_Card from "./Course_Card";

const CourseSlider = ({ Courses }) => {
  return (
    <>
      {Courses?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
          {Courses?.map((course, i) => (
            <div key={i} className="flex justify-center">
              <Course_Card course={course} Height={"h-[230px] md:h-[250px]"} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  );
};

export default CourseSlider;
