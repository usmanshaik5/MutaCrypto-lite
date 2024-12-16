import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "react-google-login"; // Corrected import
import { gapi } from "gapi-script";
import { login } from "../../../services/operations/authAPI";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";

// Google OAuth clientId
const clientId =
  "679316281861-fpjbu1ptj9770v1jduo2kur3lvllklc3.apps.googleusercontent.com";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [verified, setVerified] = useState(false);

  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if(verified){dispatch(login(email, password, navigate));}

    
  };

  const functionforstudent = (e) => {
    e.preventDefault();
    setFormData({
      email: "21uec012@lnmiit.ac.in",
      password: "1234",
    });
    dispatch(login("21uec012@lnmiit.ac.in", "1234", navigate));
  };

  const functionforinstructor = (e) => {
    e.preventDefault();
    setFormData({
      email: "agamsuthar1003@gmail.com",
      password: "123",
    });
    dispatch(login("agamsuthar1003@gmail.com", "123", navigate));
  };

  const handleGoogleSuccess = (response) => {
     
    console.log("Google login successful");
    const email = "agamsuthar1003@gmail.com";
    console.log(email);

    const password = "123";
    setFormData({
      email: email,
      password: password,
    });
    dispatch(login(email, password, navigate));
  };

  const handleGoogleFailure = (response) => {
    console.error("Google login failed", response);
  };

const handleOnChange1 = (value) => {
  console.log("Captcha value:", value);
  setVerified(true); // This value can be sent to your backend for further verification
};
  return (
    <>
      <form
        onSubmit={handleOnSubmit}
        className="mt-6 flex w-full flex-col gap-y-4"
      >
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-5 p-[12px] text-richblack-1000 "
          />
        </label>
        <label className="relative">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-5 p-[12px] pr-12 text-richblack-1000"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
          <Link to="/forgot-password">
            <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
              Forgot Password
            </p>
          </Link>
        </label>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-caribbeangreen-200 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Sign In
        </button>
        <p className=" text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Are you a visitor? Login without Credentials.
        </p>
        <div className="flex flex-row gap-2 justify-between">
          <button
            onClick={functionforstudent}
            className="rounded-[8px] w-1/2 bg-caribbeangreen-200 py-[8px] px-[12px] font-light text-sm text-richblack-900 animate-bounce"
          >
            Visitor Login as Student
          </button>
          <button
            onClick={functionforinstructor}
            className=" rounded-[8px] w-1/2 bg-caribbeangreen-200 py-[8px] px-[12px] font-light text-sm text-richblack-900 animate-bounce"
          >
            Visitor Login as Instructor
          </button>
        </div>
        <ReCAPTCHA
          sitekey="6LfNH0kqAAAAANoeGOony82ryzAcLcEtv1PpUJ-p"
          onChange={handleOnChange1}
          className=" rounded-[8px]"
        />
      </form>

      <div className="mt-4">
        <GoogleLogin
          clientId={clientId}
          buttonText="Login with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
          cookiePolicy={"single_host_origin"}
          className=" bg-caribbeangreen-200 w-full rounded-xl"
        />
      </div>
    </>
  );
}

export default LoginForm;
