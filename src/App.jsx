import "./App.css";
import { Editor } from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import * as Babel from "@babel/standalone";

function App() {
  const [value, setValue] = useState(`
// Example:
c("Console test");

c("Hello world! ")

const console = async()=>{

    const response = await fetch("https://jsonplaceholder.org/posts/1")
    const data = await response.json()
    c(data)
}

console()
`);

  const debounceTimeoutRef = useRef(null);

  const debounce = (func, delay) => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(func, delay);
  };

  const handleEditorChange = async (newValue) => {
    setValue(newValue);
    debounce(async () => {
      try {
        // Transformar el código con Babel
        const transformedCode = Babel.transform(value, {
          presets: ["env"],
        }).code;

        const console = document.querySelector(".console");
        console.innerHTML = "";

        // Insertar el script inicial al principio del código transformado
        const scriptInicial = `
          function c(text) {
            // Obtener todos los elementos con la clase "console"
            var consoles = document.querySelectorAll('.console');
            
            // Iterar sobre todos los elementos y agregar el texto al innerHTML
            consoles.forEach(function(consoleElement) {
                if (typeof text === "object") {
                    // Si text es un objeto, recórrelo y muestra cada propiedad de manera interactiva
                    var html = '<div class="text-blue-400 pb-20">{';
                    Object.keys(text).forEach(function(key) {
                        html += '<div style="margin-left: 20px;">' + key + ': ' + text[key] + '</div>';
                    });
                    html += '}</div>';
                    consoleElement.innerHTML += html;
                } else {
                    // Si text no es un objeto, simplemente muestra el texto
                    consoleElement.innerHTML += '<div>' + text + '</div>';
                }
            });
          }
        `;
        const codigoFinal = scriptInicial + transformedCode;

        // Ejecutar el código transformado con el script inicial
        await eval(codigoFinal);
      } catch (error) {
        console.error("Error al compilar el código:", error);
      }
    }, 500); // Espera 1 segundo antes de ejecutar la función después del último cambio
  };

  return (
    <div className="container h-screen overflow-hidden">
      <nav className="w-full h-[50px] bg-[#1e1e1e] border-b-2 border-gray-50/20" />
      <figure className="h-[20px] bg-[#1e1e1e]" />
      <main className="flex flex-row h-full w-full">
        <Editor
          width={"60vw"}
          className=""
          height={"90vh"}
          theme="vs-dark"
          language="javascript"
          value={value}
          onChange={handleEditorChange}
        />
        <div
          style={{ width: "40vw" }}
          className="output p-4 bg-[#1e1e1e] text-white overflow-y-scroll"
        >
          <div className="">Output</div>
          <div className="console flex flex-col gap-3 text-[12px]"></div>
        </div>
      </main>
    </div>
  );
}

export default App;
