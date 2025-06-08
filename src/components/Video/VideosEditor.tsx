import React, { useState } from "react";
import { mockVideos } from "@/constants/videos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import { tools } from "@/constants/fields";

export default function VideosEditor() {
  const [videos, setVideos] = useState([...mockVideos]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: "",
    title: "",
    url: "",
    youtubeId: "",
    tool: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // Preenche o formulário para editar
  const handleEdit = (video: any) => {
    setEditing(video.id);
    setForm({
      ...video,
      date: video.date ? video.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
  };

  // Limpa o formulário
  const handleClear = () => {
    setEditing(null);
    setForm({
      id: "",
      title: "",
      url: "",
      youtubeId: "",
      tool: "",
      date: new Date().toISOString().slice(0, 10),
    });
  };

  // Salva vídeo (novo ou edição)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setVideos(videos.map(v =>
        v.id === editing
          ? { ...form, id: editing }
          : v
      ));
    } else {
      const newId = uuidv4();
      setVideos([
        ...videos,
        { ...form, id: newId }
      ]);
    }
    handleClear();
  };

  // Remove vídeo
  const handleRemove = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
    if (editing === id) handleClear();
  };

  // Exporta o JSON dos vídeos para download
  const handleExport = () => {
    const dataStr = JSON.stringify(videos, null, 2);
    const blob = new Blob([`export const mockVideos = ${dataStr};\n`], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mockVideos.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Editor de Vídeos</h1>
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
            <Label htmlFor="url">URL do Vídeo</Label>
            <Input
              id="url"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://youtube.com/..."
              required
            />
          </div>
          <div>
            <Label htmlFor="youtubeId">YouTube ID</Label>
            <Input
              id="youtubeId"
              value={form.youtubeId}
              onChange={e => setForm(f => ({ ...f, youtubeId: e.target.value }))}
              placeholder="Ex: dQw4w9WgXcQ"
              required
            />
          </div>
          <div>
            <Label htmlFor="tool">Ferramenta</Label>
            <select
              id="tool"
              value={form.tool}
              onChange={e => setForm(f => ({ ...f, tool: e.target.value }))}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Selecione</option>
              {tools.map(tool => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
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
        <div className="flex gap-4">
          <Button type="submit">{editing ? "Salvar Alterações" : "Adicionar Vídeo"}</Button>
          {editing && (
            <Button type="button" variant="outline" onClick={handleClear}>
              Cancelar
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={handleExport}>
            Exportar mockVideos
          </Button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">Vídeos Cadastrados</h2>
      <div className="space-y-4">
        {videos.map(video => (
          <div key={video.id} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between border">
            <div className="flex items-center gap-4">
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt={video.title}
                style={{ width: 120, height: 68, borderRadius: 6, border: "1px solid #eee", objectFit: "cover" }}
              />
              <div>
                <div className="font-bold">{video.title}</div>
                <div className="text-xs text-gray-600">{video.tool} • {video.date}</div>
                <div className="text-xs text-blue-600 break-all">{video.url}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleRemove(video.id)}>
                Remover
              </Button>
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="text-gray-500 text-center py-8">Nenhum vídeo cadastrado.</div>
        )}
      </div>
    </div>
  );
}