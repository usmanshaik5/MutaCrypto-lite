import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import { getCatalogaPageData } from "../services/operations/pageAndComponentData";
import Course_Card from "../components/core/Catalog/Course_Card";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import { useSelector } from "react-redux";
import Error from "./Error";

const Catalog = () => {
  const { loading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [selectedBranch, setSelectedBranch] = useState(""); // New state for branch
  const [catalogPageData, setCatalogPageData] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  // Fetch all categories
  useEffect(() => {
    const getCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      const category_id = res?.data?.data?.filter(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      )[0]._id;
      setCategoryId(category_id);
    };
    getCategories();
  }, [catalogName]);

  // Fetch category details
  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogaPageData(categoryId);
        setCatalogPageData(res);
       
      } catch (error) {
        console.log(error);
      }
    };
    if (categoryId) {
      getCategoryDetails();
    }
  }, [categoryId]);
 
  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  if (!loading && !catalogPageData.success) {
    return <Error />;
  }

  // Filter courses based on selected branch
   console.log(catalogPageData);
  const filteredCourses = catalogPageData?.data?.selectedCategory?.courses.filter(
      (course) =>
        !selectedBranch || course.branch.includes(selectedBranch)
    );


  return (
    <>
      <div className="h-20"></div>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-1000 px-4 border-b-2 border-blue-200">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog /` }
            <span className="text-blue-1000">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200 font-normal">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              !selectedBranch
                ? "border-b border-b-blue-1000 text-blue-1000"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setSelectedBranch("")}
          >
            All
          </p>
          <p
            className={`px-4 py-2 ${
              selectedBranch === "CSE"
                ? "border-b border-b-blue-1000 text-blue-1000"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setSelectedBranch("CSE")}
          >
            CSE
          </p>
          <p
            className={`px-4 py-2 ${
              selectedBranch === "ECE"
                ? "border-b border-b-blue-1000 text-blue-1000"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setSelectedBranch("ECE")}
          >
            ECE
          </p>
          <p
            className={`px-4 py-2 ${
              selectedBranch === "CCE"
                ? "border-b border-b-blue-1000 text-blue-1000"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setSelectedBranch("CCE")}
          >
            CCE
          </p>
          <p
            className={`px-4 py-2 ${
              selectedBranch === "ME"
                ? "border-b border-b-blue-1000 text-blue-1000"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setSelectedBranch("ME")}
          >
            ME
          </p>
        </div>
        <div>
          <CourseSlider
            Courses={filteredCourses}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Catalog;
