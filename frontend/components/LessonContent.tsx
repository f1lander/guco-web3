"use client";

import React from "react";

interface LessonContentProps {
  content: string;
}

export const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
  // Split content into sections based on markdown headers
  const sections = content.split(/(?=# )/).filter(Boolean);

  const renderSection = (section: string) => {
    // Split into lines
    const lines = section.split("\n").filter(Boolean);

    // First line is the header
    const header = lines[0];
    if (!header) return null;

    // Get header level safely
    const headerMatch = header.match(/^#+/);
    const headerLevel = headerMatch ? headerMatch[0].length : 0;
    const headerText = header.replace(/^#+\s*/, "");

    // Rest of the lines are content
    const contentLines = lines.slice(1);

    // Track if we're inside a code block
    let inCodeBlock = false;
    let currentCodeBlock: string[] = [];

    return (
      <div key={header} className="mb-12">
        {/* Render header based on level */}
        {headerLevel === 1 && (
          <h1 className="text-4xl font-mono font-bold mb-6 text-gray-100">
            {headerText}
          </h1>
        )}
        {headerLevel === 2 && (
          <h2 className="text-3xl font-mono font-bold mb-4 text-gray-200">
            {headerText}
          </h2>
        )}
        {headerLevel === 3 && (
          <h3 className="text-2xl font-mono font-bold mb-4 text-gray-300">
            {headerText}
          </h3>
        )}

        {/* Render content lines */}
        <div className="space-y-4">
          {contentLines.map((line, index) => {
            // Handle code block start
            if (line.startsWith("```")) {
              if (!inCodeBlock) {
                inCodeBlock = true;
                currentCodeBlock = [];
                return null;
              } else {
                inCodeBlock = false;
                const codeContent = currentCodeBlock.join("\n");
                currentCodeBlock = [];
                return (
                  <pre
                    key={index}
                    className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto border border-gray-700/50"
                  >
                    <code className="text-sm font-mono text-gray-200">
                      {codeContent}
                    </code>
                  </pre>
                );
              }
            }

            // Collect code block content
            if (inCodeBlock) {
              currentCodeBlock.push(line);
              return null;
            }

            // Handle lists
            if (line.startsWith("- ")) {
              return (
                <ul key={index} className="list-none pl-4 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                    <span>{line.replace("- ", "")}</span>
                  </li>
                </ul>
              );
            }

            // Handle numbered lists
            if (line.match(/^\d+\./)) {
              return (
                <ol key={index} className="list-none pl-4 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="font-mono text-gray-500">
                      {line.match(/^\d+/)?.[0]}.
                    </span>
                    <span>{line.replace(/^\d+\.\s*/, "")}</span>
                  </li>
                </ol>
              );
            }

            // Handle bold text with **
            if (line.includes("**")) {
              return (
                <p key={index} className="text-gray-300">
                  {line.split("**").map((part, i) =>
                    i % 2 === 0 ? (
                      part
                    ) : (
                      <strong key={i} className="font-bold text-gray-100">
                        {part}
                      </strong>
                    ),
                  )}
                </p>
              );
            }

            // Handle single # as separator
            if (line === "#") {
              return (
                <hr key={index} className="my-8 border-t border-gray-700" />
              );
            }

            // Regular text
            return (
              <p key={index} className="text-gray-300 leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  return <div className="w-full">{sections.map(renderSection)}</div>;
};
