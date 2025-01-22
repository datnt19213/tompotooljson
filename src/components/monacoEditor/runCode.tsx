import { useState } from "react";
import { ToastError, ToastSuccess } from "../toast";
import { excuteCode } from "../../apis/runCodeMonaco";
import * as Babel from "@babel/standalone";

export const RunCode = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef?.current?.getValue();
    if (!sourceCode) {
      ToastError({ msg: "🚀 Cannot get code" });
      return;
    }

    try {
      setIsLoading(true);

      // Biên dịch JSX sang JavaScript ES5
      const compiledCode = Babel.transform(sourceCode, {
        presets: ["react", "env"],
      }).code;

      // Chèn runtime React để thực thi mã
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.text = `
        (function() {
          const React = window.React;
          const ReactDOM = window.ReactDOM;
          ${compiledCode}
          ReactDOM.render(React.createElement(App), document.getElementById("output"));
        })();
      `;
      document.body.appendChild(script);

      ToastSuccess({ msg: "Code executed successfully!" });
    } catch (error) {
      ToastError({ msg: "🚀 Execution failed" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-start p-2">
      <div className="w-[150px]">
        <button
          onClick={runCode}
          className="h-10 px-4 text-sm bg-[#444] text-white rounded-full relative"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="h-6 w-6 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                <div className="absolute top-0 left-0 h-6 w-6 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
              </div>
            </div>
          ) : (
            " Run Code"
          )}
        </button>
      </div>
      <div
        className={`p-2 w-full ${
          isError ? "text-red-500 border-red-500" : "border-[#333]"
        } border-1 border-solid border-r-[4px] `}
      >
        {/* {output
          ? output.map((line, i) => <div key={i}>{line}</div>)
          : 'Click "Run Code" to see the output here'} */}
      </div>
    </div>
  );
};

export default RunCode;
