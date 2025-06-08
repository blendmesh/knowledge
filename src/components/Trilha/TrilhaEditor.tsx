import React, { useState } from "react";
import { mockTrilhas } from "@/constants/trilhas";
import { mockCourses } from "@/constants/courses";
import { mockTutorials } from "@/constants/tutorials";
import { mockPosts } from "@/constants/blog";
import { mockVideos } from "@/constants/videos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";

const ITEM_TYPES = [
    { value: "curso", label: "Curso" },
    { value: "tutorial", label: "Tutorial" },
    { value: "artigo", label: "Artigo" },
    { value: "video", label: "Vídeo" },
];

function getItemList(type: string) {
    switch (type) {
        case "curso":
            return mockCourses.map(c => ({ id: c.id, title: c.title, type: "curso" }));
        case "tutorial":
            return mockTutorials.map(t => ({ id: t.id, title: t.title, type: "tutorial" }));
        case "artigo":
            return mockPosts.map(p => ({ id: p.id, title: p.title, type: "artigo" }));
        case "video":
            return mockVideos.map(v => ({ id: v.id, title: v.title, type: "video" }));
        default:
            return [];
    }
}

export default function TrilhaEditor() {
    const [trilhas, setTrilhas] = useState([...mockTrilhas]);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState({
        id: "",
        title: "",
        description: "",
        items: [] as { type: string; id: string | number }[],
    });

    // Adiciona item à trilha
    const [itemType, setItemType] = useState("curso");
    const [itemId, setItemId] = useState<string | number>("");

    const handleAddItem = () => {
        if (!itemId) return;
        setForm(f => ({
            ...f,
            items: [...f.items, { type: itemType, id: itemId }],
        }));
        setItemId("");
    };

    // Remove item da trilha
    const handleRemoveItem = (idx: number) => {
        setForm(f => ({
            ...f,
            items: f.items.filter((_, i) => i !== idx),
        }));
    };

    // Preenche o formulário para editar
    const handleEdit = (trilha: any) => {
        setEditing(trilha.id);
        setForm({
            ...trilha,
            items: trilha.items || [],
        });
    };

    // Limpa o formulário
    const handleClear = () => {
        setEditing(null);
        setForm({
            id: "",
            title: "",
            description: "",
            items: [],
        });
        setItemType("curso");
        setItemId("");
    };

    // Salva trilha (novo ou edição)
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            setTrilhas(trilhas.map(t =>
                t.id === editing
                    ? { ...form, id: editing }
                    : t
            ));
        } else {
            const newId = uuidv4();
            setTrilhas([
                ...trilhas,
                { ...form, id: newId }
            ]);
        }
        handleClear();
    };

    // Remove trilha
    const handleRemove = (id: string) => {
        setTrilhas(trilhas.filter(t => t.id !== id));
        if (editing === id) handleClear();
    };

    // Exporta o JSON das trilhas para download
    const handleExport = () => {
        const dataStr = JSON.stringify(trilhas, null, 2);
        const blob = new Blob([`export const mockTrilhas = ${dataStr};\n`], { type: "text/javascript" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mockTrilhas.js";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Editor de Trilhas de Aprendizagem</h1>
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
                    <div className="md:col-span-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            required
                        />
                    </div>
                </div>
                <div>
                    <Label>Itens da Trilha</Label>
                    <div className="flex gap-2 mb-2">
                        <select
                            value={itemType}
                            onChange={e => {
                                setItemType(e.target.value);
                                setItemId("");
                            }}
                            className="border rounded px-2 py-1"
                        >
                            {ITEM_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        <select
                            value={itemId}
                            onChange={e => setItemId(e.target.value)}
                            className="border rounded px-2 py-1"
                        >
                            <option value="">Selecione</option>
                            {getItemList(itemType).map(item => (
                                <option key={item.id} value={item.id}>{item.title}</option>
                            ))}
                        </select>
                        <Button type="button" onClick={handleAddItem} disabled={!itemId}>Adicionar</Button>
                    </div>
                    <ol className="list-decimal ml-6">
  {form.items.map((item, idx) => {
    let title = "";
    if (item.type === "curso") {
      const c = mockCourses.find(c => c.id === item.id);
      title = c ? `[Curso] ${c.title}` : `[Curso]`;
    } else if (item.type === "tutorial") {
      const t = mockTutorials.find(t => t.id === item.id);
      title = t ? `[Tutorial] ${t.title}` : `[Tutorial]`;
    } else if (item.type === "artigo") {
      const p = mockPosts.find(p => p.id === item.id);
      title = p ? `[Artigo] ${p.title}` : `[Artigo]`;
    } else if (item.type === "video") {
      const v = mockVideos.find(v => String(v.id) === String(item.id));
      title = v ? `[Vídeo] ${v.title}` : `[Vídeo]`;
    }
    return (
      <li key={idx} className="flex items-center gap-2">
        <span className="font-mono text-xs text-gray-500">#{idx + 1}</span>
        <span>{title}</span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={idx === 0}
          onClick={() => {
            if (idx === 0) return;
            setForm(f => {
              const items = [...f.items];
              [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
              return { ...f, items };
            });
          }}
        >
          ↑
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={idx === form.items.length - 1}
          onClick={() => {
            if (idx === form.items.length - 1) return;
            setForm(f => {
              const items = [...f.items];
              [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
              return { ...f, items };
            });
          }}
        >
          ↓
        </Button>
        <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveItem(idx)}>
          Remover
        </Button>
      </li>
    );
  })}
</ol>
                </div>
                <div className="flex gap-4">
                    <Button type="submit">{editing ? "Salvar Alterações" : "Adicionar Trilha"}</Button>
                    {editing && (
                        <Button type="button" variant="outline" onClick={handleClear}>
                            Cancelar
                        </Button>
                    )}
                    <Button type="button" variant="secondary" onClick={handleExport}>
                        Exportar mockTrilhas
                    </Button>
                </div>
            </form>

            <h2 className="text-xl font-semibold mb-4">Trilhas Cadastradas</h2>
            <div className="space-y-4">
                {trilhas.map(trilha => (
                    <div key={trilha.id} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between border">
                        <div>
                            <div className="font-bold">{trilha.title}</div>
                            <div className="text-sm text-gray-600">{trilha.description}</div>
                            <ol className="list-decimal ml-5 mt-2">
                                {trilha.items && trilha.items.map((item: any, idx: number) => {
                                    let title = "";
                                    if (item.type === "curso") {
                                        const c = mockCourses.find(c => c.id === item.id);
                                        title = c ? `[Curso] ${c.title}` : `[Curso]`;
                                    } else if (item.type === "tutorial") {
                                        const t = mockTutorials.find(t => t.id === item.id);
                                        title = t ? `[Tutorial] ${t.title}` : `[Tutorial]`;
                                    } else if (item.type === "artigo") {
                                        const p = mockPosts.find(p => p.id === item.id);
                                        title = p ? `[Artigo] ${p.title}` : `[Artigo]`;
                                    } else if (item.type === "video") {
                                        const v = mockVideos.find(v => String(v.id) === String(item.id));
                                        title = v ? `[Vídeo] ${v.title}` : `[Vídeo]`;
                                    }
                                    return <li key={idx}>{title}</li>;
                                })}
                            </ol>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(trilha)}>
                                Editar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRemove(trilha.id)}>
                                Remover
                            </Button>
                        </div>
                    </div>
                ))}
                {trilhas.length === 0 && (
                    <div className="text-gray-500 text-center py-8">Nenhuma trilha cadastrada.</div>
                )}
            </div>
        </div>
    );
}