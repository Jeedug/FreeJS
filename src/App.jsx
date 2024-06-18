import "./App.css";
import { useState, useEffect, useRef } from "react";
import * as Babel from "@babel/standalone";
import { MenuIcon, X, XIcon } from "lucide-react";
import TextEditor from "./components/TextEditor";
import initialScript from "./utils/initialScript";

function App() {
  const [error, setError] = useState(null);
  const [value, setValue] = useState("// text here");

  const debounceTimeoutRef = useRef(null);

  const debounce = (func, delay) => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(func, delay);
  };

  const evaluateCode = async (code) => {
    try {
      const transformedCode = Babel.transform(code, {
        presets: ["env"],
      }).code;
      const consoleElement = document.querySelector(".console");
      consoleElement.innerHTML = "";
      const codigoFinal = initialScript + transformedCode;
      await eval(codigoFinal);
      setError(null);
    } catch (error) {
      const consoleElement = document.querySelector(".console");
      consoleElement.innerHTML = "";
      setError(error.stack);
    }
  };

  const handleEditorChange = async (newValue) => {
    setValue(newValue);
    debounce(() => evaluateCode(newValue), 500); // Espera 1 segundo antes de ejecutar la función después del último cambio
  };

  useEffect(() => {
    debounce(() => evaluateCode(value), 500); 

    window.addEventListener("load", () => {
      console.log("loaded");
      const getMarginViewOverlays = document.querySelectorAll(".margin-view-overlay");
      getMarginViewOverlays.forEach((overlay) => {
        overlay.className = "bg-blue-400";
      });
    });
  
    // Limpieza del evento al desmontar el componente
    return () => {
      window.removeEventListener("load", () => {
        console.log("loaded");
      });
    };
    
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <nav className="w-full h-[50px] bg-[#1e1e1e] border-b-2 border-gray-50/20 flex flex-row">
        <div className="flex-row group hover:bg-[#2b2b2b] cursor-pointer transition select-none text-[14px] font-medium flex items-center justify-between gap-2 px-3 h-full border border-b-transparent border-l-transparent border-t-transparent border-white/20 text-white">
          <MenuIcon className="w-[14px] text-white group-hover:scale-125 cursor-pointer transition" />
          <span className=" h-[20px]">Menu</span>
        </div>
        <div className="flex-row hover:bg-[#252525]e bg-[#2c2c2c] transition select-none text-[14px] font-medium flex items-center justify-between gap-2 px-3 h-full border border-b-transparent border-l-transparent border-t-transparent border-white/20 text-white">
          <XIcon className="w-[14px] text-gray-500 hover:scale-125 cursor-pointer hover:text-white transition" />
          <span className=" h-[20px]">Main Tab</span>
        </div>
        <div className="flex-row hover:bg-[#252525] transition select-none text-[14px] font-medium flex items-center justify-between gap-2 px-3 h-full border border-b-transparent border-l-transparent border-t-transparent border-white/20 text-white">
          <XIcon className="w-[14px] text-gray-500 hover:scale-125 cursor-pointer hover:text-white transition" />
          <span className=" h-[20px]">Operators</span>
        </div>
        <div className="flex-row hover:bg-[#252525] transition select-none  text-[14px] font-medium flex items-center justify-between gap-2 px-3 h-full border border-b-transparent border-l-transparent border-t-transparent border-white/20 text-white">
          <XIcon className="w-[14px] text-gray-500 hover:scale-125 cursor-pointer hover:text-white transition" />
          <span className=" h-[20px]">Fetch</span>
        </div>
      </nav>
      <TextEditor setValue={setValue} value={value} handleEditorChange={handleEditorChange} error={error} />
    </div>
  );
}

export default App;
