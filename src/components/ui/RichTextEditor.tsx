"use client";

import React, { useState, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode, $createHeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { LinkNode, AutoLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
} from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $setBlocksType } from "@lexical/selection";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List as ListIcon,
  ListOrdered,
  Link2,
  Undo2,
  Redo2,
} from "lucide-react";

interface InitialStateProps {
  initialHtml: string;
}

function InitialStatePlugin({ initialHtml }: InitialStateProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialHtml) return;
    editor.update(() => {
      const root = $getRoot();
      if (root.isEmpty()) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        root.append(...nodes);
      }
    });
  }, [editor, initialHtml]);

  return null;
}

interface MyOnChangePluginProps {
  onChange: (html: string) => void;
}

function MyOnChangePlugin({ onChange }: MyOnChangePluginProps) {
  const [editor] = useLexicalComposerContext();
  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          onChange(html);
        });
      }}
    />
  );
}

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));
          setIsUnderline(selection.hasFormat("underline"));
          setIsStrikethrough(selection.hasFormat("strikethrough"));

          const anchorNode = selection.anchor.getNode();
          const element =
            anchorNode.getKey() === "root"
              ? anchorNode
              : anchorNode.getTopLevelElementOrThrow();

          const type = element.getType();
          if (type === "heading") {
            const tag = (element as any).getTag();
            setBlockType(tag);
          } else {
            setBlockType(type);
          }
        }
      });
    });
  }, [editor]);

  const formatBlock = (type: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (type === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (type === "h1" || type === "h2" || type === "h3") {
          $setBlocksType(selection, () => $createHeadingNode(type as any));
        }
      }
    });
  };

  const insertLink = () => {
    const url = prompt("Enter the URL:");
    if (url !== null) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 rounded-t-xl select-none">
      {/* Block Type Dropdown */}
      <select
        value={blockType}
        onChange={(e) => formatBlock(e.target.value)}
        className="px-2 py-1 text-xs font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#ed1c27]/40 cursor-pointer text-gray-700 h-8"
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      {/* Formatting buttons */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={`p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors ${
          isBold ? "text-[#ed1c27] bg-[#ed1c27]/10" : "text-gray-600"
        }`}
        title="Bold"
      >
        <Bold size={14} />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={`p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors ${
          isItalic ? "text-[#ed1c27] bg-[#ed1c27]/10" : "text-gray-600"
        }`}
        title="Italic"
      >
        <Italic size={14} />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={`p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors ${
          isUnderline ? "text-[#ed1c27] bg-[#ed1c27]/10" : "text-gray-600"
        }`}
        title="Underline"
      >
        <Underline size={14} />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
        className={`p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors ${
          isStrikethrough ? "text-[#ed1c27] bg-[#ed1c27]/10" : "text-gray-600"
        }`}
        title="Strikethrough"
      >
        <Strikethrough size={14} />
      </button>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        className="p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors"
        title="Bullet List"
      >
        <ListIcon size={14} />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        className="p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors"
        title="Numbered List"
      >
        <ListOrdered size={14} />
      </button>

      <button
        type="button"
        onClick={insertLink}
        className="p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors"
        title="Insert Link"
      >
        <Link2 size={14} />
      </button>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      {/* Alignment */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        className="p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors"
        title="Align Left"
      >
        <AlignLeft size={14} />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        className="p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors"
        title="Align Center"
      >
        <AlignCenter size={14} />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        className="p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors"
        title="Align Right"
      >
        <AlignRight size={14} />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}
        className="p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors"
        title="Align Justify"
      >
        <AlignJustify size={14} />
      </button>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      {/* Undo/Redo */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors"
        title="Undo"
      >
        <Undo2 size={14} />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-600 transition-colors"
        title="Redo"
      >
        <Redo2 size={14} />
      </button>
    </div>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorConfig = {
    namespace: "BlogEditor",
    theme: {
      paragraph: "mb-2 text-xs leading-relaxed text-gray-800 font-medium",
      heading: {
        h1: "text-xl font-bold mb-3 mt-2 text-gray-900",
        h2: "text-lg font-bold mb-2.5 mt-2 text-gray-900",
        h3: "text-md font-bold mb-2 mt-2 text-gray-900",
      },
      list: {
        nested: {
          listitem: "list-none",
        },
        ol: "list-decimal ml-5 mb-2 text-xs font-medium text-gray-800",
        ul: "list-disc ml-5 mb-2 text-xs font-medium text-gray-800",
        listitem: "mb-1",
      },
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
      },
      link: "text-[#ed1c27] underline hover:text-[#c5141e] cursor-pointer",
    },
    onError(error: Error) {
      console.error(error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="w-full border border-gray-200 rounded-xl bg-white focus-within:border-[#ed1c27]/40 overflow-hidden relative">
        <Toolbar />
        <div className="relative min-h-[250px] max-h-[400px] overflow-y-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-[250px] p-4 text-xs text-gray-800 font-medium" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 text-xs pointer-events-none font-medium">
                Start writing article content...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <InitialStatePlugin initialHtml={value} />
          <MyOnChangePlugin onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}
