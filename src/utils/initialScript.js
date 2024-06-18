const initialScript = `

    class console{
    static log(text) {
          var consoles = document.querySelectorAll('.console');
          consoles.forEach(function(consoleElement) {
            if (typeof text === "object") {
              var html = '<div class="text-blue-400 select-none cursor-pointer">{';
              Object.keys(text).forEach(function(key) {
                html += '<div style="margin-left: 20px;">' + key + ': ' + JSON.stringify(text[key], null, 2).replace(/\\n/g, '<br>').replace(/\\s/g, '&nbsp;') + '</div>';
              });
              html += '}</div>';
              consoleElement.innerHTML += html;
            } else if (typeof text === "number") {
              var textWithLineBreaks = text.toString().replace(/\\n/g, '<br>');
              consoleElement.innerHTML += '<div class="cursor.pointer select-none hover:bg-gray-50">' + textWithLineBreaks + '</div>';
            }else {
              var textWithLineBreaks = text.replace(/\\n/g, '<br>');
              consoleElement.innerHTML += '<div class="cursor-pointer select-none hover:bg-[#4f4f4f] rounded-lg transition">' + textWithLineBreaks + '</div>';
            }
          });
        }
    
    }


        
      `;

export default initialScript;



/*
  const apiKey = "AIzaSyBoHampb2irZJUCoHzUiPVUzs251sTXKbk";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstructions
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 2048,
    responseMimeType: "text/plain",
  };

  async function run(value) {
    const chatSession = model.startChat({
      generationConfig,
    });
    const result = await chatSession.sendMessage(trasnformedValue);
    setCopilotCompletion(result.message);
  }


*/
