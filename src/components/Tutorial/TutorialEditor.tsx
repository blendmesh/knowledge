import React, { useState, useRef } from "react";
import { mockTutorials } from "@/constants/tutorials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { tools, levels } from "@/constants/fields";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Bold, Italic, List, ListOrdered, Code, Table } from "lucide-react";

// Função para obter a data atual no formato yyyy-mm-dd
function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// Funções auxiliares para inserir markdown
function insertAtCursor(textarea: HTMLTextAreaElement | null, before: string, after: string = "", placeholder = "") {
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.substring(start, end) || placeholder;
  const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
  textarea.value = newValue;
  textarea.focus();
  textarea.selectionStart = start + before.length;
  textarea.selectionEnd = start + before.length + selected.length;
  // Retorna o novo valor para atualizar o estado
  return textarea.value;
}

export default function TutorialEditor() {
  const [tutorials, setTutorials] = useState([...mockTutorials]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    tool: "",
    level: "",
    tags: "",
    date: getToday(),
    url: "",
    markdown: "",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Preenche o formulário para editar
  const handleEdit = (tutorial: any) => {
    setEditing(tutorial.id);
    setForm({
      ...tutorial,
      tags: tutorial.tags ? tutorial.tags.join(", ") : "",
    });
  };

  // Limpa o formulário
  const handleClear = () => {
    setEditing(null);
    setForm({
      id: "",
      title: "",
      description: "",
      tool: "",
      level: "",
      tags: "",
      date: getToday(),
      url: "",
      markdown: "",
    });
  };

  // Salva tutorial (novo ou edição)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    if (editing) {
      setTutorials(tutorials.map(t =>
        t.id === editing
          ? { ...form, id: editing, tags: tagsArr }
          : t
      ));
    } else {
      const newId = uuidv4();
      setTutorials([
        ...tutorials,
        { ...form, id: newId, tags: tagsArr, url: `/tutorials/${newId}` }
      ]);
    }
    handleClear();
  };

  // Remove tutorial
  const handleRemove = (id: string) => {
    setTutorials(tutorials.filter(t => t.id !== id));
    if (editing === id) handleClear();
  };

  // Exporta o JSON dos tutoriais para download
  const handleExport = () => {
    const dataStr = JSON.stringify(tutorials, null, 2);
    const blob = new Blob([`export const mockTutorials = ${dataStr};\n`], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mockTutorials.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Funções dos botões de formatação
  const handleFormat = (type: string) => {
    let before = "", after = "", placeholder = "";
    switch (type) {
      case "bold":
        before = "**"; after = "**"; placeholder = "negrito";
        break;
      case "italic":
        before = "_"; after = "_"; placeholder = "itálico";
        break;
      case "ul":
        before = "- "; after = ""; placeholder = "item";
        break;
      case "ol":
        before = "1. "; after = ""; placeholder = "item";
        break;
      case "code":
        before = "```\n"; after = "\n```"; placeholder = "código";
        break;
      case "table":
        before = "| Cabeçalho 1 | Cabeçalho 2 |\n| ----------- | ----------- |\n| Valor 1     | Valor 2     |\n"; after = ""; placeholder = "";
        break;
      default:
        return;
    }
    const newValue = insertAtCursor(textareaRef.current, before, after, placeholder);
    if (newValue !== undefined) {
      setForm(f => ({ ...f, markdown: newValue }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Editor de Tutoriais</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="tool">Ferramenta</Label>
            <Select
              value={form.tool}
              onValueChange={value => setForm(f => ({ ...f, tool: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a ferramenta" />
              </SelectTrigger>
              <SelectContent scroll={false} side="bottom" position="popper" avoidCollisions={false}>
                {tools.map(tool => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="level">Nível</Label>
            <Select
              value={form.level}
              onValueChange={value => setForm(f => ({ ...f, level: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent scroll={false} side="bottom" position="popper" avoidCollisions={false}>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="markdown">Conteúdo (Markdown)</Label>
          <div className="mb-2 flex flex-wrap gap-2">
            <ToggleGroup type="multiple" className="gap-2">
              <ToggleGroupItem
                value="bold"
                aria-label="Negrito"
                onClick={() => handleFormat("bold")}
                type="button"
              >
                <Bold className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="italic"
                aria-label="Itálico"
                onClick={() => handleFormat("italic")}
                type="button"
              >
                <Italic className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="ul"
                aria-label="Lista"
                onClick={() => handleFormat("ul")}
                type="button"
              >
                <List className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="ol"
                aria-label="Numeração"
                onClick={() => handleFormat("ol")}
                type="button"
              >
                <ListOrdered className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="code"
                aria-label="Código"
                onClick={() => handleFormat("code")}
                type="button"
              >
                <Code className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="table"
                aria-label="Tabela"
                onClick={() => handleFormat("table")}
                type="button"
              >
                <Table className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <Textarea
            id="markdown"
            ref={textareaRef}
            rows={8}
            value={form.markdown}
            onChange={e => setForm(f => ({ ...f, markdown: e.target.value }))}
            required
          />
        </div>
        <div className="mb-4">
          <Label>Preview</Label>
          <div className="border rounded bg-gray-50 p-4 mt-2 tutorial-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-3" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-3" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    className="my-4 rounded shadow max-w-full"
                    style={{ maxHeight: 350 }}
                    alt={props.alt || ''}
                  />
                ),
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(props.className || '');
                  return !inline ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match ? match[1] : 'bash'}
                      PreTag="div"
                      customStyle={{ borderRadius: 8, margin: '16px 0', fontSize: 15 }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-200 px-1 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 my-4" {...props} />
                ),
                p: ({ node, ...props }) => <p className="mb-3" {...props} />,
                a: ({ node, ...props }) => (
                  <a className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <table className="border border-collapse my-4 w-full" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th className="border px-2 py-1 bg-gray-100" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="border px-2 py-1" {...props} />
                ),
              }}
            >
              {form.markdown}
            </ReactMarkdown>
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="submit">{editing ? "Salvar Alterações" : "Adicionar Tutorial"}</Button>
          {editing && (
            <Button type="button" variant="outline" onClick={handleClear}>
              Cancelar
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={handleExport}>
            Exportar mockTutorials
          </Button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">Tutoriais Cadastrados</h2>
      <div className="space-y-4">
        {tutorials.map(tutorial => (
          <div key={tutorial.id} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between border">
            <div>
              <div className="font-bold">{tutorial.title}</div>
              <div className="text-sm text-gray-600">{tutorial.description}</div>
              <div className="flex gap-2 mt-1 flex-wrap">
                <Badge variant="secondary">{tutorial.tool}</Badge>
                <Badge variant="outline">{tutorial.level}</Badge>
                {tutorial.tags && tutorial.tags.map((tag: string) => (
                  <Badge key={tag} variant="default">{tag}</Badge>
                ))}
                <span className="text-xs text-gray-400 ml-2">{tutorial.date}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button size="sm" variant="outline" onClick={() => handleEdit(tutorial)}>
                Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleRemove(tutorial.id)}>
                Remover
              </Button>
            </div>
          </div>
        ))}
        {tutorials.length === 0 && (
          <div className="text-gray-500 text-center py-8">Nenhum tutorial cadastrado.</div>
        )}
      </div>
    </div>
  );
}