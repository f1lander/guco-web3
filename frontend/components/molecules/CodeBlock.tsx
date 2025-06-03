"use client";
import React, { useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  funky,
  dracula,
  oneDark,
  oneLight,
  solarizedlight,
  okaidia,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { IconCheck, IconCopy } from "@tabler/icons-react";

// Create a themes object for easier selection
const codeThemes = {
  atomDark,
  funky,
  dracula,
  oneDark,
  oneLight,
  solarizedlight,
  okaidia,
};

export type CodeTheme = keyof typeof codeThemes;

// Local storage key for theme preference
const THEME_STORAGE_KEY = "code-block-theme-preference";

type CodeBlockProps = {
  language: string;
  filename: string;
  highlightLines?: number[];
  theme?: CodeTheme;
} & (
  | {
      code: string;
      tabs?: never;
    }
  | {
      code?: never;
      tabs: Array<{
        name: string;
        code: string;
        language?: string;
        highlightLines?: number[];
      }>;
    }
);

export const CodeBlock = ({
  language,
  filename,
  code,
  highlightLines = [],
  tabs = [],
  theme: propTheme,
}: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedTheme, setSelectedTheme] =
    React.useState<CodeTheme>("atomDark");

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(
      THEME_STORAGE_KEY,
    ) as CodeTheme | null;
    // Use saved theme if available, prop theme if provided, or default to atomDark
    setSelectedTheme(savedTheme || propTheme || "atomDark");
  }, [propTheme]);

  // Save theme to localStorage when it changes
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as CodeTheme;
    setSelectedTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const tabsExist = tabs.length > 0;

  const copyToClipboard = async () => {
    const textToCopy = tabsExist ? tabs[activeTab].code : code;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCode = tabsExist ? tabs[activeTab].code : code;
  const activeLanguage = tabsExist
    ? tabs[activeTab].language || language
    : language;
  const activeHighlightLines = tabsExist
    ? tabs[activeTab].highlightLines || []
    : highlightLines;

  return (
    <div className="relative w-full rounded-lg bg-slate-950 p-4 font-mono text-sm flex flex-col h-full">
      <div className="flex flex-col gap-2 flex-shrink-0">
        {tabsExist && (
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-3 !py-2 text-xs transition-colors font-sans ${
                  activeTab === index
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        {!tabsExist && filename && (
          <div className="flex justify-between items-center py-2">
            <div className="text-xs text-zinc-400">{filename}</div>

            <div className="flex items-center gap-3">
              {/* Theme selector dropdown */}
              <select
                value={selectedTheme}
                onChange={handleThemeChange}
                className="bg-slate-800 text-xs text-zinc-300 rounded px-2 py-1 border border-slate-700"
              >
                {Object.keys(codeThemes).map((themeName) => (
                  <option key={themeName} value={themeName}>
                    {themeName.replace(/([A-Z])/g, " $1").trim()}
                  </option>
                ))}
              </select>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
              >
                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-auto flex-grow relative">
        <div className="min-w-full h-[250px]">
          <SyntaxHighlighter
            language={activeLanguage}
            style={codeThemes[selectedTheme]}
            customStyle={{
              margin: 0,
              padding: 0,
              background: "transparent",
              fontSize: "0.875rem",
              height: "100%",
              minWidth: "100%",
            }}
            wrapLines={true}
            showLineNumbers={true}
            lineProps={(lineNumber) => ({
              style: {
                backgroundColor: activeHighlightLines.includes(lineNumber)
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
                display: "block",
                width: "100%",
              },
            })}
            PreTag="div"
          >
            {String(activeCode)}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};
