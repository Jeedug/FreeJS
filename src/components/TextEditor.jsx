import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import systemInstructions from "../utils/systemInstructions";

export default function TextEditor({
  value,
  handleEditorChange,
  error,
  setValue,
}) {
  const [lastValue, setLastValue] = useState(value);
  const [changePosition, setChangePosition] = useState(null);
  const [modifiedValue, setModifiedValue] = useState("");
  const [copilotCompletion, setCopilotCompletion] = useState("");
  const [visual, setVisual] = useState(false);
  const [floatingDivPosition, setFloatingDivPosition] = useState({ x: 0, y: 0 }); // Estado para la posición del div flotante

  useEffect(() => {
    const findCursorPosition = () => {
      const lastLines = lastValue.split("\n");
      const currentLines = value.split("\n");

      for (let i = 0; i < currentLines.length; i++) {
        if (lastLines[i] !== currentLines[i]) {
          const position = currentLines[i] ? currentLines[i].length + 1 : 0;
          setChangePosition({ line: i + 1, position });
          break;
        }
      }
    };

    findCursorPosition();
    setLastValue(value);
    if (changePosition) {
      const lines = value.split("\n");
      lines[changePosition.line - 1] =
        lines[changePosition.line - 1].slice(0, changePosition.position) +
        "|FILL HERE|" +
        lines[changePosition.line - 1].slice(changePosition.position);
      setModifiedValue(lines.join("\n"));
    }

    const timer = setTimeout(() => {
      const apiKey = "AIzaSyBoHampb2irZJUCoHzUiPVUzs251sTXKbk";
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemInstructions,
      });

      async function run(modifiedValue) {
        const chatSession = model.startChat({
          generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
          },
        });
        const result = await chatSession.sendMessage(modifiedValue);
        setCopilotCompletion(result.response.text());
        setVisual(true);
      }

      run(modifiedValue);
    }, 2000);

    return () => clearTimeout(timer);
  }, [value, changePosition, modifiedValue]);

  // Calcular la posición del div flotante
  useEffect(() => {
    if (changePosition) {
      // Obtener la posición del editor de texto
      const editor = document.querySelector(".monaco-editor");
      const editorPosition = editor.getBoundingClientRect();

      // Obtener el índice del cursor en el editor de texto
      const cursorIndex = value.split("\n")
        .slice(0, changePosition.line - 1)
        .reduce((acc, line) => acc + line.length + 1, 0) + changePosition.position;

      // Obtener la posición del cursor en función del índice
      const cursorPosition = editor
        .querySelector(".view-lines")
        .getBoundingClientRect();
      const lineHeight = editor
        .querySelector(".view-line")
        .getBoundingClientRect().height;
      const lines = Math.floor(cursorIndex / value.length);
      const columns = cursorIndex % value.length;

      const y = cursorPosition.top + lines * lineHeight;
      const x = cursorPosition.left + columns * 10; // Ajusta según sea necesario

      setFloatingDivPosition({ x, y });
    }
  }, [changePosition, value]);

  // Actualizar el estado visual cuando cambia el valor del editor
  useEffect(() => {
    setVisual(false); // Ocultar el div flotante cuando se modifica el texto
  }, [value]);

  return (
    <main className="flex flex-row h-full w-full relative">
      <Editor
        width={"60vw"}
        height={"100vh"}
        theme="vs-dark"
        language="javascript"
        value={value}
        onChange={handleEditorChange}
      />
      {/* Mostrar el div flotante solo cuando haya una sugerencia */}
      {visual && (
        <div
          className="text-gray-400 bg-black text-sm max-w-[300px] z-100 absolute left-20 bottom-20"
        >
          {copilotCompletion}
        </div>
      )}
      <div
        style={{ width: "40vw" }}
        className="output pb-20 bg-[#1e1e1e] text-white overflow-y-scroll h-full"
      >
        <div className="text-[24px] font-semibold mb-5 border border-[#4a4a4a] border-t-transparent border-r-transparent border-l-transparent py-[1px]">
          Output
        </div>
        <div className="console flex flex-col gap-3 text-[16px] font-semibold px-2"></div>
        {error ? <div className="text-red-500">{error}</div> : ""}
      </div>
    </main>
  );
}
