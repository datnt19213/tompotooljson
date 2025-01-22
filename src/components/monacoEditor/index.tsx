import Editor from "@monaco-editor/react";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setDataComponent } from "../../store/DndSlice";
import { RootState } from "../../store";

import {
  MonacoJsxSyntaxHighlight,
  getWorker,
} from "monaco-jsx-syntax-highlight";
import { defaultCode, language } from "./const";
import LoadingEditor from "./loadingEditor";

const MonacoEditor = () => {
  const editorRef = useRef(null);

  const [jsonObject, setJsonObject] = useState({});
  const [error, setError] = useState(null);

  const { dataComponent, activeId, loadingMonacoEditor } = useSelector(
    (state: RootState) => state.dndSlice
  );

  const dispatch = useDispatch();

  const handleEditorDidMount = useCallback(async (editor: any, monaco: any) => {
    editorRef.current = editor;

    const reactTypeUrl = "https://unpkg.com/@types/react/index.d.ts";
    const reactDomTypeUrl = "https://unpkg.com/@types/react-dom/index.d.ts";

    // Tải type definitions từ CDN
    const [reactTypeContent, reactDomTypeContent] = await Promise.all([
      fetch(reactTypeUrl).then((res) => res.text()),
      fetch(reactDomTypeUrl).then((res) => res.text()),
    ]);

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactTypeContent,
      "file:///node_modules/@types/react/index.d.ts"
    );

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactDomTypeContent,
      "file:///node_modules/@types/react-dom/index.d.ts"
    );

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      allowSyntheticDefaultImports: true,
    });

    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(
      getWorker(),
      monaco
    );

    // editor is the result of monaco.editor.create
    const { highlighter, dispose } =
      monacoJsxSyntaxHighlight.highlighterBuilder({
        editor: editor,
      });
    // init highlight
    highlighter();

    editor.onDidChangeModelContent(() => {
      // content change, highlight
      highlighter();
    });

    return dispose;
  }, []);

  const handleEditorChange = (value: any) => {
    dispatch(setDataComponent(value));
  };

  return (
    <div className="flex">
      <div className="w-full relative">
        <Editor
          height="90vh"
          path={"file:///src/component/monacoEditor/index.tsx"}
          onMount={handleEditorDidMount}
          defaultLanguage={language}
          defaultValue={defaultCode}
          onChange={handleEditorChange}
          theme="vs-dark"
          // value={
          //   "// Initial Code Example\nexport default function Example() {\n  return <div>Hello, World!</div>;\n}"
          // }
          options={{
            fontSize: 16,
            lineHeight: 28,
            automaticLayout: true,
          }}
          loading={
            <div className="relative flex flex-col justify-center items-center">
              <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin"></div>
              <div className="">Loading Monaco Editor...</div>
            </div>
          }
        />
        {loadingMonacoEditor && <LoadingEditor />}
      </div>
      {/* <div id="output" className="w-full bg-gray-100"></div> */}
      {/* <div className="w-1/3 bg-gray-500">
        <RunCode editorRef={editorRef} language={language} />
      </div> */}
    </div>
  );
};

export default MonacoEditor;
