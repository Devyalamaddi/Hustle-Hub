import { FaUserCheck, FaSignInAlt, FaKey, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiReact, SiSocketdotio, SiJsonwebtokens } from "react-icons/si";
import { AiOutlineCloud } from "react-icons/ai"; 

const AuthImagePattern = ({ title, subtitle }) => {
  const icons = [
    <FaSignInAlt />,       
    <FaUserCheck />,       
    <FaKey />,             
    <SiMongodb />,         
    <SiReact />,           
    <FaNodeJs />,          
    <SiSocketdotio />,     
    <SiJsonwebtokens />,  
    <AiOutlineCloud />,    
  ];

  return (
    <div className="hidden lg:flex items-center justify-center p-12 text-[var(--text-primary)]">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {icons.map((icon, i) => (
            <div
              key={i}
              className="flex items-center justify-center aspect-square rounded-xl 
                         bg-[var(--card)] p-7 transform transition-transform duration-500 
                         hover:scale-110 hover:rotate-3 shadow-md"
            >
              <div className="text-3xl text-[var(--primary)]">{icon}</div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-[var(--text-secondary)]">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
