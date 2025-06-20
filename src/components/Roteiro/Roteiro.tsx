import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { roteiros as roteirosConst } from "@/constants/roteiros";
import { tools as ferramentas, levels as niveis } from "@/constants/fields";
import jsPDF from "jspdf";
import { v4 as uuidv4 } from "uuid";

const cmToPt = (cm: number) => cm * 28.3465;

function formatInlineMarkdown(text: string) {
  // Negrito, itálico e code simples
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: text
          .replace(/`([^`]+)`/g, '<code style="background:#eee;padding:2px 4px;border-radius:4px;font-size:14px;">$1</code>')
          .replace(/\*\*([^\*]+)\*\*/g, '<b>$1</b>')
          .replace(/\*([^\*]+)\*/g, '<i>$1</i>')
      }}
    />
  );
}

function breakLines(doc: jsPDF, text: string, maxWidth: number) {
  // Usa splitTextToSize, mas força a quebra apenas em espaços
  // Remove quebras em hífens e outros caracteres
  return doc.splitTextToSize(text, maxWidth, {
    splitByWord: true,
    // Garante que só quebra em espaço
    // splitRegex: /(\s+)/g // (não é suportado em todas versões do jsPDF)
  });
}

function formatRoteiroForCinema(md: string) {
  const lines = md.split("\n");
  const preview: React.ReactNode[] = [];
  let lastWasCharacter = false;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];

    // Título de cena: começa com ##
    if (/^##\s*/.test(line)) {
      preview.push(
        <div key={`scene-${idx}`} style={{ textAlign: "left", fontWeight: "bold", margin: "24px 0 8px 0", letterSpacing: 2, fontSize: 18, textTransform: "uppercase" }}>
          {line.replace(/^##\s*/, "")}
        </div>
      );
      lastWasCharacter = false;
    }
    // Abertura: ====TEXTO====
    else if (/^====[^=]+====$/.test(line.trim())) {
      const text = line.trim().replace(/^====(.+)====$/, (_, t) => t.trim().toUpperCase());
      preview.push(
        <div key={`abertura-${idx}`} style={{ textAlign: "left", fontSize: 15, textTransform: "uppercase", margin: "32px 0 0 0", letterSpacing: 2 }}>
          {text}
        </div>
      );
      lastWasCharacter = false;
    }
    // Encerramento: ===TEXTO===
    else if (/^===[^=]+===$/.test(line.trim())) {
      const text = line.trim().replace(/^===(.+)===$/, (_, t) => t.trim().toUpperCase());
      preview.push(
        <div key={`fim-${idx}`} style={{ textAlign: "right", fontSize: 15, textTransform: "uppercase", margin: "32px 0 0 0", letterSpacing: 2 }}>
          {text}
        </div>
      );
      lastWasCharacter = false;
    }
    // Nome do personagem: **NOME:**
    else if (/^\*\*([A-Z0-9À-ÿ\s]+):\*\*/.test(line)) {
      const match = line.match(/^\*\*([A-Z0-9À-ÿ\s]+):\*\*/);
      const nome = match ? match[1].toUpperCase() : "";
      preview.push(
        <div key={`char-${idx}`} style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, margin: "0 0 0 0", letterSpacing: 1 }}>
          {nome}
        </div>
      );
      lastWasCharacter = true;
    }
    // Diálogo: linha após personagem (com markdown inline)
    else if (lastWasCharacter && line.trim() !== "") {
      preview.push(
        <div key={`dialog-${idx}`} style={{ margin: "0 0 16px 0", paddingLeft: cmToPt(2.5), paddingRight: cmToPt(5), textAlign: "left" }}>
          {formatInlineMarkdown(line.trim())}
        </div>
      );
      lastWasCharacter = false;
    }
    // Bloco de código markdown
    else if (/^```/.test(line)) {
      const codeLines: string[] = [];
      let codeLang = "";
      let i = idx;
      if (line.trim().length > 3) {
        codeLang = line.trim().slice(3).trim();
      }
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      preview.push(
        <div key={`code-${idx}`} style={{ position: "relative", margin: "12px 0" }}>
          {codeLang && (
            <span style={{
              position: "absolute",
              top: 6,
              right: 16,
              fontSize: 12,
              color: "#bbb",
              fontFamily: "monospace",
              zIndex: 2
            }}>
              {codeLang}
            </span>
          )}
          <pre style={{ background: "#222", color: "#fff", borderRadius: 6, padding: 12, fontSize: 14, overflowX: "auto", margin: 0 }}>
            <code>
              {codeLines.join("\n")}
            </code>
          </pre>
        </div>
      );
      idx = i;
      lastWasCharacter = false;
    }
    // Linha horizontal markdown
    else if (/^---+$/.test(line.trim())) {
      preview.push(
        <hr key={`hr-${idx}`} style={{ border: "none", borderTop: "1px solid #bbb", margin: "16px 0" }} />
      );
      lastWasCharacter = false;
    }
    // Linha de código simples markdown
    else if (/`([^`]+)`/.test(line)) {
      preview.push(
        <div key={`inlinecode-${idx}`} style={{ margin: "0 0 8px 0", fontFamily: "Courier, monospace", fontSize: 15 }}>
          {formatInlineMarkdown(line)}
        </div>
      );
      lastWasCharacter = false;
    }
    // Negrito e itálico markdown
    else if (/\*\*([^\*]+)\*\*/.test(line) || /\*([^\*]+)\*/.test(line)) {
      preview.push(
        <div key={`mdstyle-${idx}`} style={{ margin: "0 0 8px 0", fontFamily: "Courier, monospace", fontSize: 15 }}>
          {formatInlineMarkdown(line)}
        </div>
      );
      lastWasCharacter = false;
    }
    // Ação/descritivo
    else if (line.trim() !== "") {
      preview.push(
        <div key={`action-${idx}`} style={{ margin: "0 0 8px 0", fontFamily: "Courier, monospace", fontSize: 15 }}>
          {line}
        </div>
      );
      lastWasCharacter = false;
    } else {
      preview.push(<div key={`empty-${idx}`} style={{ height: 8 }} />);
      lastWasCharacter = false;
    }
  }

  return <article style={{ background: "#fff", color: "#222" }}>{preview}</article>;
}

type Roteiro = {
  id: string;
  titulo: string;
  nivel: string;
  ferramenta: string;
  conteudo: string;
};

export default function RoteiroEditor() {
  const [roteiros, setRoteiros] = useState<Roteiro[]>(
    roteirosConst.map(r => ({
      ...r,
      id: typeof r.id === "string" ? r.id : uuidv4(),
    }))
  );
  const [titulo, setTitulo] = useState("");
  const [nivel, setNivel] = useState(niveis[0]);
  const [ferramenta, setFerramenta] = useState(ferramentas[0]);
  const [conteudo, setConteudo] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // Exportação PDF com a mesma formatação do preview e sem sobreposição
  // Atualize a exportação do PDF para usar margem de 2cm (aprox. 57pt)
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });
    const margin = cmToPt(2); // 2cm ~ 56.7pt
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;

    doc.setFont("courier", "normal");
    doc.setFontSize(18);
    doc.text(breakLines(doc, titulo, contentWidth), margin, margin + 20);
    doc.setFontSize(12);
    doc.text(breakLines(doc, `Nível: ${nivel}    Ferramenta: ${ferramenta}`, contentWidth), margin, margin + 50);
    doc.setFontSize(12);

    const lines = conteudo.split("\n");
    let y = margin + 80;
    let lastWasCharacter = false;

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];

      // Título de cena
      if (/^##\s*/.test(line)) {
        doc.setFont(undefined, "bold");
        doc.setFontSize(18);
        const sceneLines = breakLines(doc, line.replace(/^##\s*/, "").toUpperCase(), contentWidth);
        sceneLines.forEach(sceneLine => {
          doc.text(sceneLine, margin, y, { align: "left" });
          y += 20;
          if (y > pageHeight - margin - 40) {
            doc.addPage();
            y = margin + 20;
          }
        });
        doc.setFont(undefined, "normal");
        doc.setFontSize(12);
        lastWasCharacter = false;
      }
      // Abertura: ====TEXTO====
      else if (/^====[^=]+====$/.test(line.trim())) {
        const text = line.trim().replace(/^====(.+)====$/, (_, t) => t.trim().toUpperCase());
        doc.setFont(undefined, "normal");
        doc.setFontSize(12);
        const aberturaLines = breakLines(doc, text, contentWidth);
        aberturaLines.forEach(abLine => {
          doc.text(abLine, margin, y, { align: "left" });
          y += 16;
          if (y > pageHeight - margin - 40) {
            doc.addPage();
            y = margin + 20;
          }
        });
        lastWasCharacter = false;
      }
      // Encerramento: ===TEXTO===
      else if (/^===[^=]+===$/.test(line.trim())) {
        const text = line.trim().replace(/^===(.+)===$/, (_, t) => t.trim().toUpperCase());
        doc.setFont(undefined, "normal");
        doc.setFontSize(12);
        const fimLines = breakLines(doc, text, contentWidth);
        fimLines.forEach(fimLine => {
          doc.text(fimLine, margin + contentWidth, y, { align: "right" });
          y += 16;
          if (y > pageHeight - margin - 40) {
            doc.addPage();
            y = margin + 20;
          }
        });
        lastWasCharacter = false;
      }
      // Nome do personagem
      else if (/^\*\*([A-Z0-9À-ÿ\s]+):\*\*/.test(line)) {
        const match = line.match(/^\*\*([A-Z0-9À-ÿ\s]+):\*\*/);
        const nome = match ? match[1].toUpperCase() : "";
        doc.setFont(undefined, "bold");
        doc.setFontSize(16);
        const nomeLines = breakLines(doc, nome, contentWidth);
        nomeLines.forEach(nomeLine => {
          doc.text(nomeLine, margin + contentWidth / 2, y, { align: "center" });
          y += 18;
          if (y > pageHeight - margin - 40) {
            doc.addPage();
            y = margin + 20;
          }
        });
        doc.setFont(undefined, "normal");
        doc.setFontSize(12);
        lastWasCharacter = true;
      }
      // Diálogo (com markdown inline)
      else if (lastWasCharacter && line.trim() !== "") {
        const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
        // Monta os segmentos com estilo
        let currentLine = "";
        const segments: { text: string; style: "normal" | "bold" | "italic" | "code" }[] = [];
        parts.forEach(part => {
          if (/^`[^`]+`$/.test(part)) {
            if (currentLine) {
              segments.push({ text: currentLine, style: "normal" });
              currentLine = "";
            }
            segments.push({ text: part.slice(1, -1), style: "code" });
          } else if (/^\*\*[^*]+\*\*$/.test(part)) {
            if (currentLine) {
              segments.push({ text: currentLine, style: "normal" });
              currentLine = "";
            }
            segments.push({ text: part.replace(/^\*\*|\*\*$/g, ""), style: "bold" });
          } else if (/^\*[^*]+\*$/.test(part)) {
            if (currentLine) {
              segments.push({ text: currentLine, style: "normal" });
              currentLine = "";
            }
            segments.push({ text: part.replace(/^\*|\*$/g, ""), style: "italic" });
          } else {
            currentLine += part;
          }
        });
        if (currentLine) {
          segments.push({ text: currentLine, style: "normal" });
        }

        // Junta todos os textos para quebra de linha correta
        const fullText = segments.map(s => s.text).join("");
        // Quebra em palavras, nunca no meio
        const dialogWords = fullText.split(/(\s+)/g); // preserva espaços
        const linesDialog: string[] = [];
        let lineDialog = "";
        const maxWidth = contentWidth - cmToPt(2.5) - cmToPt(5);

        dialogWords.forEach(word => {
          const testLine = lineDialog + word;
          if (doc.getTextWidth(testLine) > maxWidth && lineDialog !== "") {
            linesDialog.push(lineDialog);
            lineDialog = word.trimStart(); // remove espaço extra no início
          } else {
            lineDialog = testLine;
          }
        });
        if (lineDialog) linesDialog.push(lineDialog);

        // Agora renderiza cada linha, aplicando os estilos
        let charIndex = 0;
        let yDialog = y;
        linesDialog.forEach(dl => {
          let xLine = margin + cmToPt(2.5);
          let remaining = dl.length;
          let segIdx = 0;
          let segOffset = 0;

          // Avança até o segmento correto para o início da linha
          let charsPassed = 0;
          while (segIdx < segments.length && charsPassed + segments[segIdx].text.length <= charIndex) {
            charsPassed += segments[segIdx].text.length;
            segIdx++;
          }
          segOffset = charIndex - charsPassed;

          while (remaining > 0 && segIdx < segments.length) {
            const seg = segments[segIdx];
            // Calcula quanto do segmento cabe nesta linha
            const segText = seg.text.slice(segOffset, segOffset + remaining);
            const drawText = segText;
            const fontSize = 12; // Sempre 12 para todo diálogo

            // Define estilo
            if (seg.style === "bold") {
              doc.setFont(undefined, "bold");
            } else if (seg.style === "italic") {
              doc.setFont(undefined, "italic");
            } else {
              doc.setFont(undefined, "normal");
            }
            doc.setFontSize(fontSize);

            if (seg.style === "code") {
              const codeWidth = doc.getTextWidth(drawText) + 8;
              doc.setFillColor(230, 230, 230);
              doc.rect(xLine, yDialog - 10, codeWidth, 16, "F");
              doc.setFont("courier", "normal");
              doc.setFontSize(12);
              doc.text(drawText, xLine + 4, yDialog + 2);
              doc.setFont("courier", "normal");
              xLine += codeWidth;
            } else {
              doc.text(drawText, xLine, yDialog);
              xLine += doc.getTextWidth(drawText);
            }

            // Avança para o próximo segmento se necessário
            if (segOffset + remaining >= seg.text.length) {
              remaining -= (seg.text.length - segOffset);
              charIndex += (seg.text.length - segOffset);
              segIdx++;
              segOffset = 0;
            } else {
              charIndex += remaining;
              segOffset += remaining;
              remaining = 0;
            }
          }
          yDialog += 16;
          if (yDialog > pageHeight - margin - 40) {
            doc.addPage();
            yDialog = margin + 20;
          }
        });
        y = yDialog;
        lastWasCharacter = false;
      }
      // Bloco de código markdown
      else if (/^```/.test(line)) {
        const codeLines: string[] = [];
        let codeLang = "";
        let i = idx;
        if (line.trim().length > 3) {
          codeLang = line.trim().slice(3).trim();
        }
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        const codeBoxHeight = 18 + codeLines.length * 14 + 12;
        doc.setFillColor(34, 34, 34);
        doc.roundedRect(margin, y, contentWidth, codeBoxHeight, 6, 6, "F");
        if (codeLang) {
          doc.setTextColor(187, 187, 187);
          doc.setFontSize(12);
          doc.text(codeLang, margin + contentWidth - 10, y + 14, { align: "right" });
        }
        doc.setTextColor(255, 255, 255);
        doc.setFont("courier", "normal");
        doc.setFontSize(14);
        codeLines.forEach((l, idx2) => {
          const codeLineParts = breakLines(doc, l, contentWidth - 24);
          codeLineParts.forEach((cl, cidx) => {
            doc.text(cl, margin + 12, y + 28 + (idx2 + cidx) * 14);
          });
        });
        doc.setTextColor(0, 0, 0);
        doc.setFont("courier", "normal");
        doc.setFontSize(12);
        y += codeBoxHeight + 8;
        idx = i;
        lastWasCharacter = false;
      }
      // Linha horizontal markdown
      else if (/^---+$/.test(line.trim())) {
        doc.setDrawColor(180, 180, 180);
        doc.line(margin, y, margin + contentWidth, y);
        y += 12;
        lastWasCharacter = false;
      }
      // Linha de código simples markdown
      else if (/`([^`]+)`/.test(line)) {
        const parts = line.split(/(`[^`]+`)/g);
        let x = margin;
        let textLine = "";
        parts.forEach(part => {
          if (/^`[^`]+`$/.test(part)) {
            if (textLine) {
              const textLines = breakLines(doc, textLine, contentWidth - (x - margin));
              textLines.forEach(tl => {
                doc.text(tl, x, y);
                y += 16;
                if (y > pageHeight - margin - 40) {
                  doc.addPage();
                  y = margin + 20;
                }
              });
              textLine = "";
            }
            doc.setFillColor(230, 230, 230);
            doc.rect(x, y - 10, doc.getTextWidth(part.slice(1, -1)) + 8, 16, "F");
            doc.setFont("courier", "normal");
            doc.setFontSize(12); // igual ao texto normal
            doc.text(part.slice(1, -1), x + 4, y + 2);
            x += doc.getTextWidth(part.slice(1, -1)) + 12;
            doc.setFont("courier", "normal");
            doc.setFontSize(12);
          } else {
            textLine += part;
          }
        });
        if (textLine) {
          const textLines = breakLines(doc, textLine, contentWidth - (x - margin));
          textLines.forEach(tl => {
            doc.text(tl, x, y);
            y += 16;
            if (y > pageHeight - margin - 40) {
              doc.addPage();
              y = margin + 20;
            }
          });
        } else {
          y += 16;
        }
        lastWasCharacter = false;
      }
      // Negrito e itálico markdown
      else if (/\*\*([^\*]+)\*\*/.test(line) || /\*([^\*]+)\*/.test(line)) {
        const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
        let x = margin;
        let textLine = "";
        parts.forEach(part => {
          if (/^`[^`]+`$/.test(part)) {
            if (textLine) {
              const textLines = breakLines(doc, textLine, contentWidth - (x - margin));
              textLines.forEach(tl => {
                doc.text(tl, x, y);
                y += 16;
                if (y > pageHeight - margin - 40) {
                  doc.addPage();
                  y = margin + 20;
                }
              });
              textLine = "";
            }
            doc.setFillColor(230, 230, 230);
            doc.rect(x, y - 10, doc.getTextWidth(part.slice(1, -1)) + 8, 16, "F");
            doc.setFont("courier", "normal");
            doc.setFontSize(12); // igual ao texto normal
            doc.text(part.slice(1, -1), x + 4, y + 2);
            x += doc.getTextWidth(part.slice(1, -1)) + 12;
            doc.setFont("courier", "normal");
            doc.setFontSize(12);
          } else if (/^\*\*[^*]+\*\*$/.test(part)) {
            if (textLine) {
              const textLines = breakLines(doc, textLine, contentWidth - (x - margin));
              textLines.forEach(tl => {
                doc.text(tl, x, y);
                y += 16;
                if (y > pageHeight - margin - 40) {
                  doc.addPage();
                  y = margin + 20;
                }
              });
              textLine = "";
            }
            doc.setFont(undefined, "bold");
            doc.text(part.replace(/^\*\*|\*\*$/g, ""), x, y);
            x += doc.getTextWidth(part.replace(/^\*\*|\*\*$/g, ""));
            doc.setFont(undefined, "normal");
          } else if (/^\*[^*]+\*$/.test(part)) {
            if (textLine) {
              const textLines = breakLines(doc, textLine, contentWidth - (x - margin));
              textLines.forEach(tl => {
                doc.text(tl, x, y);
                y += 16;
                if (y > pageHeight - margin - 40) {
                  doc.addPage();
                  y = margin + 20;
                }
              });
              textLine = "";
            }
            doc.setFont(undefined, "italic");
            doc.text(part.replace(/^\*|\*$/g, ""), x, y);
            x += doc.getTextWidth(part.replace(/^\*|\*$/g, ""));
            doc.setFont(undefined, "normal");
          } else {
            textLine += part;
          }
        });
        if (textLine) {
          const textLines = breakLines(doc, textLine, contentWidth - (x - margin));
          textLines.forEach(tl => {
            doc.text(tl, x, y);
            y += 16;
            if (y > pageHeight - margin - 40) {
              doc.addPage();
              y = margin + 20;
            }
          });
        } else {
          y += 16;
        }
        lastWasCharacter = false;
      }
      // Ação/descritivo
      else if (line.trim() !== "") {
        const actionLines = breakLines(doc, line, contentWidth);
        actionLines.forEach(actLine => {
          doc.text(actLine, margin, y);
          y += 16;
          if (y > pageHeight - margin - 40) {
            doc.addPage();
            y = margin + 20;
          }
        });
        lastWasCharacter = false;
      } else {
        y += 8;
        lastWasCharacter = false;
      }
      if (y > pageHeight - margin - 40) {
        doc.addPage();
        y = margin + 20;
      }
    }

    doc.save(`${titulo || "roteiro"}.pdf`);
  };

  // Exportar para constants (mantendo markdown no campo conteudo)
  const handleExportJSON = () => {
    const json = `export const roteiros = ${JSON.stringify(
      roteiros.map(r => ({
        ...r,
        id: r.id,
      })),
      null,
      2
    )};`;
    const blob = new Blob([json], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roteiros.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Adicionar ou editar roteiro
  const handleSave = () => {
    if (!titulo.trim() || !conteudo.trim()) return;
    if (editId) {
      setRoteiros(roteiros.map(r =>
        r.id === editId
          ? { ...r, titulo, nivel, ferramenta, conteudo }
          : r
      ));
    } else {
      setRoteiros([
        ...roteiros,
        {
          id: uuidv4(),
          titulo,
          nivel,
          ferramenta,
          conteudo,
        }
      ]);
    }
    setTitulo("");
    setNivel(niveis[0]);
    setFerramenta(ferramentas[0]);
    setConteudo("");
    setEditId(null);
  };

  // Remover roteiro
  const handleRemove = (id: string) => {
    setRoteiros(roteiros.filter(r => r.id !== id));
    if (editId === id) {
      setTitulo("");
      setNivel(niveis[0]);
      setFerramenta(ferramentas[0]);
      setConteudo("");
      setEditId(null);
    }
  };

  // Editar roteiro
  const handleEdit = (roteiro: Roteiro) => {
    setTitulo(roteiro.titulo);
    setNivel(roteiro.nivel);
    setFerramenta(roteiro.ferramenta);
    setConteudo(roteiro.conteudo);
    setEditId(roteiro.id);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 32 }}>
      <h1 className="text-2xl font-bold mb-6">Editor de Roteiro de Vídeo</h1>
      <div style={{ marginBottom: 24, background: "#f3f4f6", borderRadius: 8, padding: 16 }}>
        <strong>Legenda para formatação do roteiro:</strong>
        <ul style={{ marginTop: 8, marginBottom: 0, fontSize: 15 }}>
          <li>
            <b>Nome da cena:</b> use <code>## Nome da Cena</code>
          </li>
          <li>
            <b>Personagem:</b> use <code>**NOME:**</code> (em maiúsculo, com dois asteriscos antes e depois, seguido de dois pontos)
          </li>
          <li>
            <b>Diálogo:</b> escreva a fala na linha abaixo do personagem (negrito, itálico e <code>`code`</code> funcionam)
          </li>
          <li>
            <b>Ações:</b> escreva normalmente, sem marcação especial
          </li>
          <li>
            <b>Abertura:</b> use <code>===ABERTURA===</code> ou <code>===QUALQUER TEXTO===</code> (irá aparecer alinhado à esquerda, maiúsculo, fonte normal)
          </li>
          <li>
            <b>Encerramento:</b> use <code>===FIM===</code> ou <code>===QUALQUER TEXTO===</code> (irá aparecer alinhado à direita, maiúsculo, fonte normal)
          </li>
          <li>
            <b>Bloco de código:</b> use <code>{'```'}</code> para abrir e fechar o bloco, e <code>{'```js'}</code> ou <code>{'```python'}</code> etc. para especificar a linguagem (ela aparecerá no canto direito superior da caixa)
          </li>
          <li>
            <b>Negrito:</b> <code>**texto**</code> &nbsp; <b>Itálico:</b> <code>*texto*</code>
          </li>
          <li>
            <b>Linha horizontal:</b> <code>---</code>
          </li>
          <li>
            <b>Código simples:</b> <code>`code`</code>
          </li>
        </ul>
      </div>

      <button
        className="bg-gray-700 text-white px-4 py-1 rounded mb-3"
        style={{ display: "block" }}
        onClick={() => setShowPreview(v => !v)}
        type="button"
      >
        {showPreview ? "Ocultar preview" : "Exibir preview"}
      </button>

      {showPreview && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            minHeight: 400,
            padding: 20,
            background: "#f9fafb",
            fontFamily: "Courier, monospace",
            marginBottom: 32
          }}
          tabIndex={0}
          aria-label="Visualização do roteiro"
          role="region"
          contentEditable={false}
          spellCheck={false}
        >
          <div style={{ fontWeight: "bold", fontSize: 20, textAlign: "center", marginBottom: 8 }}>{titulo}</div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
            Nível: {nivel} | Ferramenta: {ferramenta}
          </div>
          {formatRoteiroForCinema(conteudo)}
        </div>
      )}

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 320, maxWidth: "100%" }}>
          <label className="block mb-2 font-semibold">Título</label>
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Título do roteiro"
          />
          <label className="block mb-2 font-semibold">Nível</label>
          <select
            className="w-full border rounded px-3 py-2 mb-4"
            value={nivel}
            onChange={e => setNivel(e.target.value)}
          >
            {niveis.map(n => <option key={n}>{n}</option>)}
          </select>
          <label className="block mb-2 font-semibold">Ferramenta</label>
          <select
            className="w-full border rounded px-3 py-2 mb-4"
            value={ferramenta}
            onChange={e => setFerramenta(e.target.value)}
          >
            {ferramentas.map(f => <option key={f}>{f}</option>)}
          </select>
          <label className="block mb-2 font-semibold">Conteúdo (Markdown)</label>
          <textarea
            className="w-full border rounded px-3 py-2 mb-4"
            style={{ minWidth: 320, width: "100%", maxWidth: "100%" }}
            rows={16}
            value={conteudo}
            onChange={e => setConteudo(e.target.value)}
            placeholder={`## CENA 1\n**JOÃO:**\nOlha só, *Maria*! Veja o \`código\` abaixo:\n---\n\`\`\`js\nconsole.log("Exemplo");\n\`\`\`\n===abertura===\n===fim===`}
          />
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded font-semibold"
              onClick={handleDownloadPDF}
              type="button"
            >
              Baixar PDF
            </button>
            <button
              className="bg-green-600 text-white px-5 py-2 rounded font-semibold"
              onClick={handleExportJSON}
              type="button"
            >
              Exportar para constants
            </button>
            <button
              className="bg-indigo-600 text-white px-5 py-2 rounded font-semibold"
              onClick={handleSave}
              type="button"
            >
              {editId ? "Salvar edição" : "Adicionar roteiro"}
            </button>
            {editId && (
              <button
                className="bg-gray-400 text-white px-5 py-2 rounded font-semibold"
                onClick={() => {
                  setTitulo("");
                  setNivel(niveis[0]);
                  setFerramenta(ferramentas[0]);
                  setConteudo("");
                  setEditId(null);
                }}
                type="button"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        <h2 className="text-xl font-bold mb-4">Roteiros cadastrados</h2>
        <ul>
          {roteiros.map(r => (
            <li key={r.id} style={{ marginBottom: 18, background: "#f3f4f6", borderRadius: 8, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{r.titulo}</div>
                <div style={{ fontSize: 13, color: "#666" }}>Nível: {r.nivel} | Ferramenta: {r.ferramenta}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(r)}
                  type="button"
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleRemove(r.id)}
                  type="button"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}