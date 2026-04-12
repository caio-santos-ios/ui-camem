"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import { getUserLogged } from "@/utils/auth.util";
import dynamic from "next/dynamic";
import { useState } from "react";

const module = "D";
const routine = "D1";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CertificateTable() {
  const [html, setHtml] = useState("");
  const userLogged = getUserLogged();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <ComponentCard title="Dados Gerais" hasHeader={false}>
        <div className="grid grid-cols-6 gap-2 max-h-[calc(100dvh-16rem)] md:max-h-[calc(100dvh-16rem)] overflow-y-auto">
          <div className="col-span-6">
            <Label title="HTML"/>
            <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <MonacoEditor
                height={'450px'}
                language="html"
                theme="vs-dark"
                value={html}
                onChange={(value) => setHtml(value ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  formatOnPaste: true,
                  formatOnType: true,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      <div className="h-full">
        <iframe
          srcDoc={html}
          className="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700"
          sandbox="allow-same-origin"
          title="Preview HTML"
        />
    </div>
    </div>    
  );
}