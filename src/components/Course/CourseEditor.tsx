import React, { useState, useMemo } from "react";
import { mockCourses } from "@/constants/courses";
import { mockTutorials } from "@/constants/tutorials";
import { tools, levels, trilhas } from "@/constants/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

export default function CourseEditor() {
  const [courses, setCourses] = useState([...mockCourses]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    tool: "",
    level: "",
    url: "",
    trilha: "",
    tutorials: [] as string[], // lista de ids dos tutoriais na ordem
  });

  // Filtros para tutoriais
  const [tutorialTool, setTutorialTool] = useState("");
  const [tutorialLevel, setTutorialLevel] = useState("");

  // Tutoriais filtrados
  const filteredTutorials = useMemo(() => {
    return mockTutorials.filter(tut =>
      (!tutorialTool || tut.tool === tutorialTool) &&
      (!tutorialLevel || tut.level === tutorialLevel)
    );
  }, [tutorialTool, tutorialLevel]);

  // Ordenação dos tutoriais
  const moveTutorial = (fromIdx: number, toIdx: number) => {
    setForm(f => {
      const arr = [...f.tutorials];
      const [removed] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, removed);
      return { ...f, tutorials: arr };
    });
  };

  // Preenche o formulário para editar
  const handleEdit = (course: any) => {
    setEditing(course.id);
    setForm({
      ...course,
      tutorials: course.tutorials || [],
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
      url: "",
      trilha: "",
      tutorials: [],
    });
  };

  // Salva curso (novo ou edição)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setCourses(courses.map(c =>
        c.id === editing
          ? { ...form, id: editing, tutorials: form.tutorials }
          : c
      ));
    } else {
      const newId = uuidv4();
      setCourses([
        ...courses,
        {
          ...form,
          id: newId,
          url: `/cursos/${newId}`,
          tutorials: form.tutorials,
        }
      ]);
    }
    handleClear();
  };

  // Remove curso
  const handleRemove = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    if (editing === id) handleClear();
  };

  // Exporta o JSON dos cursos para download
  const handleExport = () => {
    const dataStr = JSON.stringify(courses, null, 2);
    const blob = new Blob([`export const mockCourses = ${dataStr};\n`], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mockCourses.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Editor de Cursos</h1>
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
            <select
              id="tool"
              value={form.tool}
              onChange={e => setForm(f => ({ ...f, tool: e.target.value }))}
              required
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecione</option>
              {tools.map(tool => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="level">Nível</Label>
            <select
              id="level"
              value={form.level}
              onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
              required
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecione</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="trilha">Trilha (opcional)</Label>
            <select
              id="trilha"
              value={form.trilha}
              onChange={e => setForm(f => ({ ...f, trilha: e.target.value }))}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Nenhuma</option>
              {trilhas.map(trilha => (
                <option key={trilha} value={trilha}>{trilha}</option>
              ))}
            </select>
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
          <Label>Tutoriais do Curso</Label>
          <div className="flex gap-2 mb-2">
            <select
              value={tutorialTool}
              onChange={e => setTutorialTool(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Todas as Ferramentas</option>
              {tools.map(tool => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
            <select
              value={tutorialLevel}
              onChange={e => setTutorialLevel(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Todos os Níveis</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div
            className="flex flex-wrap gap-2 mb-2"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              maxHeight: 500,
              overflowY: "auto",
              alignItems: "start"
            }}
          >
            {filteredTutorials.map(tut => (
              <label key={tut.id} className="flex items-center gap-1 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={form.tutorials.includes(tut.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setForm(f => ({ ...f, tutorials: [...f.tutorials, tut.id] }));
                    } else {
                      setForm(f => ({ ...f, tutorials: f.tutorials.filter(id => id !== tut.id) }));
                    }
                  }}
                />
                <span className="text-xs">{tut.title}</span>
              </label>
            ))}
          </div>
          {form.tutorials.length > 0 && (
            <div>
              <Label>Ordem dos Tutoriais</Label>
              <ol className="list-decimal ml-6">
                {form.tutorials.map((tid, idx) => {
                  const tut = mockTutorials.find(t => t.id === tid);
                  return (
                    <li key={tid} className="flex items-center gap-2">
                      <span className="font-bold mr-1">{idx + 1}.</span>
                      <span>{tut ? tut.title : tid}</span>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveTutorial(idx, idx - 1)}
                        className="text-xs px-2 py-1 border rounded disabled:opacity-50"
                      >↑</button>
                      <button
                        type="button"
                        disabled={idx === form.tutorials.length - 1}
                        onClick={() => moveTutorial(idx, idx + 1)}
                        className="text-xs px-2 py-1 border rounded disabled:opacity-50"
                      >↓</button>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <Button type="submit">{editing ? "Salvar Alterações" : "Adicionar Curso"}</Button>
          {editing && (
            <Button type="button" variant="outline" onClick={handleClear}>
              Cancelar
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={handleExport}>
            Exportar mockCourses
          </Button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">Cursos Cadastrados</h2>
      <div className="space-y-4">
        {courses.map(course => (
          <div key={course.id} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between border">
            <div>
              <div className="font-bold">{course.title}</div>
              <div className="text-sm text-gray-600">{course.description}</div>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className="px-2 py-1 bg-gray-200 rounded">{course.tool}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">{course.level}</span>
                {course.trilha && <span className="px-2 py-1 bg-blue-100 rounded">{course.trilha}</span>}
                <span className="text-xs text-gray-400 ml-2">{course.url}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-xs">Tutoriais:</span>
                <ol className="list-decimal ml-5">
                  {course.tutorials && course.tutorials.map((tid: string, idx: number) => {
                    const tut = mockTutorials.find(t => t.id === tid);
                    return tut ? <li key={tid} className="text-xs"><span className="font-bold mr-1">{idx + 1}.</span>{tut.title}</li> : null;
                  })}
                </ol>
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleRemove(course.id)}>
                Remover
              </Button>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-gray-500 text-center py-8">Nenhum curso cadastrado.</div>
        )}
      </div>
    </div>
  );
}