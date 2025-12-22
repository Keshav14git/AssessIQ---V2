import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState, useEffect, useRef } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useCall } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUserRole } from "@/hooks/useUserRole";
import LogoLoader from "./ui/LogoLoader";

function CodeEditor() {
  const call = useCall();
  const { isInterviewer } = useUserRole();
  const streamCallId = call?.id;

  const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
    streamCallId: streamCallId || "",
  });

  const updateQuestion = useMutation(api.interviews.updateInterviewQuestion);
  const updateLanguage = useMutation(api.interviews.updateInterviewLanguage);
  const updateCode = useMutation(api.interviews.updateCode);

  const [code, setCode] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local code state with DB when DB changes (and we aren't typing? Simplified: just sync)
  // Check if we need to handle "local override". For now, simple 1-way sync from DB -> State + Local edits -> DB
  // Real-time collab usually assumes "Last write wins" or operational transform.
  // For basic sync with debounce, we rely on the DB being the source of truth, 
  // but we might flicker if we type fast. 
  // However, for this MVP, we update local state only if we receive an update and we are not currently debouncing?
  // Let's stick to the basic "useEffect update" pattern for now.

  useEffect(() => {
    if (interview?.code !== undefined) {
      setCode(interview.code);
    }
  }, [interview?.code]);

  if (!interview) return <LogoLoader />;

  const customQuestions = interview.customCodingChallenges || [];
  const allQuestions = customQuestions.length > 0 ? customQuestions : CODING_QUESTIONS;

  const selectedQuestion = allQuestions.find(
    (q) => q.id === interview.currentQuestionId
  ) || allQuestions[0];

  const language = (interview.language as "javascript" | "python" | "java") || "javascript";

  const handleQuestionChange = async (questionId: string) => {
    if (!isInterviewer) return;
    const question = allQuestions.find((q) => q.id === questionId)!;

    await updateQuestion({
      id: interview._id,
      questionId,
      code: question.starterCode[language],
    });
  };

  const handleLanguageChange = async (newLanguage: "javascript" | "python" | "java") => {
    await updateLanguage({
      id: interview._id,
      language: newLanguage,
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value === undefined) return;
    setCode(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      await updateCode({
        id: interview._id,
        code: value,
      });
    }, 1000);
  };

  return (
    <ResizablePanelGroup direction="vertical" className="min-h-[calc-100vh-4rem-1px]">
      {/* QUESTION SECTION */}
      <ResizablePanel>
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {selectedQuestion.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedQuestion.description.split("\n")[0]}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* INTERVIEWER ONLY: SELECT QUESTION */}
                  {isInterviewer && (
                    <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                      <SelectContent>
                        {allQuestions.map((q: any) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.title} {q.id.startsWith("c") ? "(AI)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* CANDIDATE ONLY: SELECT LANGUAGE (Visual logic handled by disabled) */}
                  <Select value={language} onValueChange={handleLanguageChange} disabled={isInterviewer}>
                    <SelectTrigger className="w-[150px]">
                      {/* SELECT VALUE */}
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <img
                            src={`/${language}.png`}
                            alt={language}
                            className="w-5 h-5 object-contain"
                          />
                          {LANGUAGES.find((l) => l.id === language)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    {/* SELECT CONTENT */}
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${lang.id}.png`}
                              alt={lang.name}
                              className="w-5 h-5 object-contain"
                            />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PROBLEM DESC. */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <BookIcon className="h-5 w-5 text-primary/80" />
                  <CardTitle>Problem Description</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{selectedQuestion.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* PROBLEM EXAMPLES */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-full w-full rounded-md border">
                    <div className="p-4 space-y-4">
                      {selectedQuestion.examples.map((example: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <p className="font-medium text-sm">Example {index + 1}:</p>
                          <ScrollArea className="h-full w-full rounded-md">
                            <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                              <div>Input: {example.input}</div>
                              <div>Output: {example.output}</div>
                              {example.explanation && (
                                <div className="pt-2 text-muted-foreground">
                                  Explanation: {example.explanation}
                                </div>
                              )}
                            </pre>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </div>
                      ))}
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* CONSTRAINTS */}
              {selectedQuestion.constraints && (
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                    <CardTitle>Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                      {selectedQuestion.constraints.map((constraint: string, index: number) => (
                        <li key={index} className="text-muted-foreground">
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* CODE EDITOR */}
      <ResizablePanel defaultSize={60} maxSize={100}>
        <div className="h-full relative">
          <Editor
            height={"100%"}
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 18,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              wordWrap: "on",
              wrappingIndent: "indent",
            }}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
export default CodeEditor;
