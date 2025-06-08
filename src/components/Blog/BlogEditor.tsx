import React, { useState } from "react";
import { mockPosts } from "@/constants/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Bold, Italic, List, ListOrdered, Code, Table, Image as ImageIcon } from "lucide-react";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x300?text=Blog+Post";

export default function BlogEditor() {
    const [posts, setPosts] = useState([...mockPosts]);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState({
        id: "",
        title: "",
        content: "",
        image: "",
        tags: "",
        date: new Date().toISOString().slice(0, 10),
        url: "",
        author: "",
    });

    // Preenche o formulário para editar
    const handleEdit = (post: any) => {
        setEditing(post.id);
        setForm({
            ...post,
            tags: post.tags ? post.tags.join(", ") : "",
            author: post.author || "",
        });
    };

    // Limpa o formulário
    const handleClear = () => {
        setEditing(null);
        setForm({
            id: "",
            title: "",
            content: "",
            image: "",
            tags: "",
            date: new Date().toISOString().slice(0, 10),
            url: "",
            author: "",
        });
    };

    // Salva post (novo ou edição)
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean);
        const imageUrl = form.image.trim() ? form.image : PLACEHOLDER_IMAGE;
        if (editing) {
            setPosts(posts.map(p =>
                p.id === editing
                    ? { ...form, id: editing, tags: tagsArr, image: imageUrl }
                    : p
            ));
        } else {
            const newId = uuidv4();
            setPosts([
                ...posts,
                { ...form, id: newId, tags: tagsArr, url: `/blog/${newId}`, image: imageUrl }
            ]);
        }
        handleClear();
    };

    // Remove post
    const handleRemove = (id: string) => {
        setPosts(posts.filter(p => p.id !== id));
        if (editing === id) handleClear();
    };

    // Exporta o JSON dos posts para download
    const handleExport = () => {
        const dataStr = JSON.stringify(posts, null, 2);
        const blob = new Blob([`export const mockPosts = ${dataStr};\n`], { type: "text/javascript" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mockPosts.js";
        a.click();
        URL.revokeObjectURL(url);
    };

    // Função para inserir markdown no textarea
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    function handleFormat(type: string) {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = form.content;
        const before = value.substring(0, start);
        const selected = value.substring(start, end);
        const after = value.substring(end);
        let newValue = value;
        let cursor = start;

        switch (type) {
            case "bold":
                newValue = before + `**${selected || "texto em negrito"}**` + after;
                cursor = start + 2;
                break;
            case "italic":
                newValue = before + `*${selected || "itálico"}*` + after;
                cursor = start + 1;
                break;
            case "ul":
                newValue = before + `\n- ${selected || "item da lista"}` + after;
                cursor = start + 3;
                break;
            case "ol":
                newValue = before + `\n1. ${selected || "item numerado"}` + after;
                cursor = start + 4;
                break;
            case "code":
                newValue = before + `\n\`\`\`js\n${selected || "código"}\n\`\`\`\n` + after;
                cursor = start + 8;
                break;
            case "table":
                newValue = before + `\n| Cabeçalho 1 | Cabeçalho 2 |\n| --- | --- |\n| valor 1 | valor 2 |\n` + after;
                cursor = start + 2;
                break;
            case "image":
                newValue = before + `\n![descrição](https://placehold.co/400x200)\n` + after;
                cursor = start + 4;
                break;
            default:
                break;
        }
        setForm(f => ({ ...f, content: newValue }));
        setTimeout(() => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(cursor, cursor);
        }, 0);
    }

    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Editor de Artigos do Blog</h1>
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
                        <Label htmlFor="image">URL da Imagem</Label>
                        <Input
                            id="image"
                            value={form.image}
                            onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                            placeholder="https://..."
                        />
                        {/* Preview da imagem */}
                        <div className="mt-2">
                            <img
                                src={form.image.trim() ? form.image : PLACEHOLDER_IMAGE}
                                alt="Preview"
                                style={{ maxWidth: 200, maxHeight: 100, borderRadius: 6, border: "1px solid #eee" }}
                                onError={e => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                            />
                        </div>
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
                    <div>
                        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                        <Input
                            id="tags"
                            value={form.tags}
                            onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="author">Autor</Label>
                        <Input
                            id="author"
                            value={form.author}
                            onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                            placeholder="Nome do autor"
                            required
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="content">Conteúdo (Markdown)</Label>
                    <div className="mb-2 flex flex-wrap gap-2">
                        <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => handleFormat("bold")} title="Negrito">
                            <Bold className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => handleFormat("italic")} title="Itálico">
                            <Italic className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => handleFormat("ul")} title="Lista">
                            <List className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => handleFormat("ol")} title="Numeração">
                            <ListOrdered className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => handleFormat("code")} title="Código">
                            <Code className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => handleFormat("table")} title="Tabela">
                            <Table className="w-4 h-4" />
                        </button>
                        <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => handleFormat("image")} title="Imagem">
                            <ImageIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <Textarea
                        id="content"
                        ref={textareaRef}
                        rows={8}
                        value={form.content}
                        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                        required
                    />
                </div>
                <div>
                    <Label>Preview</Label>
                    <div className="border rounded bg-gray-50 p-4 mt-2" style={{ maxWidth: 700, overflowX: "auto" }}>
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
                                        onError={e => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                                    />
                                ),
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(props.className || '');
                                    return !inline ? (
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match ? match[1] : 'bash'}
                                            PreTag="div"
                                            customStyle={{ borderRadius: 8, margin: '16px 0', fontSize: 15, maxWidth: 650, overflowX: "auto" }}
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
                            {form.content}
                        </ReactMarkdown>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button type="submit">{editing ? "Salvar Alterações" : "Adicionar Artigo"}</Button>
                    {editing && (
                        <Button type="button" variant="outline" onClick={handleClear}>
                            Cancelar
                        </Button>
                    )}
                    <Button type="button" variant="secondary" onClick={handleExport}>
                        Exportar mockPosts
                    </Button>
                </div>
            </form>

            <h2 className="text-xl font-semibold mb-4">Artigos Cadastrados</h2>
            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between border">
                        <div>
                            <div className="font-bold">{post.title}</div>
                            <div className="mb-2">
                                <img
                                    src={post.image?.trim() ? post.image : PLACEHOLDER_IMAGE}
                                    alt="Imagem do post"
                                    style={{ maxWidth: 200, maxHeight: 100, borderRadius: 6, border: "1px solid #eee" }}
                                    onError={e => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                                />
                            </div>
                            <div className="text-sm text-gray-600">{post.content.slice(0, 120)}...</div>
                            <div className="flex gap-2 mt-1 flex-wrap">
                                {post.author && (
                                    <span className="px-2 py-1 bg-blue-100 rounded text-xs">{post.author}</span>
                                )}
                                {post.tags && post.tags.map((tag: string) => (
                                    <span key={tag} className="px-2 py-1 bg-gray-200 rounded text-xs">{tag}</span>
                                ))}
                                <span className="text-xs text-gray-400 ml-2">{post.date}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                                Editar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRemove(post.id)}>
                                Remover
                            </Button>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="text-gray-500 text-center py-8">Nenhum artigo cadastrado.</div>
                )}
            </div>
        </div>
    );
}