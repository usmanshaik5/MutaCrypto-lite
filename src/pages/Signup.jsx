import signupImg from "../assets/Images/signup.webp";
import Template from "../components/core/Auth/Template";
import HighlightText from "../components/core/HomePage/HighlightText";

function Signup() {
  return (
    <>
      <div className="h-20"></div>
      <Template
        title={
          <>
            New to <HighlightText text={"MutaLearn"} />
          </>
        }
        description1="Sign up first..."
        description2="Peer-driven resources to enhance your learning journey."
        image={signupImg}
        formType="signup"
      />
    </>
  );
}

export default Signup;
