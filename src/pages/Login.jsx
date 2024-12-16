import loginImg from "../assets/Images/login.webp"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <>
      <div className="h-20"></div>
      <Template
        title="Welcome Back"
        description1="Equip yourself for academic success."
        description2="Peer-driven resources to enhance your learning journey."
        image={loginImg}
        formType="login"
      />
    </>
  );
}

export default Login