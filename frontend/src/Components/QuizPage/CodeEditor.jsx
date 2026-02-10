import Editor from "@monaco-editor/react";

function CodeEditor({ value, onChange, language }) {
  return (
    <Editor
      height="88%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 22,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        cursorStyle: "line",
        cursorBlinking: "smooth",

        padding: {
          top: 20,
        },

        /* 🔥 DISABLE SUGGESTIONS */
        hover: { enabled: false },                 
        quickSuggestions: false,                    
        parameterHints: { enabled: false },      
        suggestOnTriggerCharacters: false,          
        acceptSuggestionOnEnter: "off",             
        tabCompletion: "off",
        wordBasedSuggestions: false,
        inlineSuggest: { enabled: false },
      }}
    />
  );
}

export default CodeEditor;
