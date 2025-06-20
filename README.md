# Blendmesh Knowledge

Este repositório contém o código-fonte do **Blendmesh Knowledge**, uma plataforma web para aprendizado, consulta e prática de conteúdos sobre infraestrutura como código, microsserviços e tecnologias de nuvem.

## Áreas do Site

### 1. Home
- Apresenta os principais cursos e artigos disponíveis.
- Destaques de novidades e conteúdos recomendados.
- Links rápidos para acesso às áreas de cursos, artigos e tutoriais.

### 2. Cursos
- Lista de cursos disponíveis, cada um com descrição, nível e ferramenta abordada.
- Cada curso possui uma trilha de tutoriais sequenciais.
- Progresso do usuário salvo automaticamente.
- Ao final do curso, o usuário pode realizar um quiz para testar seus conhecimentos.

### 3. Tutoriais (Classroom)
- Visualização detalhada de cada tutorial, com conteúdo em Markdown.
- Navegação lateral para acessar rapidamente outros tutoriais do curso.
- Suporte a blocos de código, imagens, listas, tabelas e links.
- Controle de acesso: só é possível avançar para o próximo tutorial após concluir o anterior.

### 4. Artigos
- Lista de artigos técnicos e de referência.
- Cada artigo pode conter exemplos, dicas e melhores práticas.

### 5. Quiz
- Questionários interativos ao final de cada curso.
- Perguntas de múltipla escolha e verdadeiro/falso.
- Feedback imediato sobre acertos e erros.
- Exibição do resultado final ao concluir o quiz.

### 6. Editor de Roteiros
- Ferramenta para criação e exportação de roteiros técnicos em formato Markdown.
- Exportação para PDF com formatação especial para roteiros de treinamento ou vídeo.

## Funcionalidades Gerais

- **Busca**: Pesquisa rápida por cursos, tutoriais e artigos.
- **Responsivo**: Interface adaptada para desktop e dispositivos móveis.
- **Exportação**: Possibilidade de exportar roteiros em PDF.
- **Navegação Protegida**: Impede acesso a conteúdos sem concluir etapas anteriores.
- **Markdown Avançado**: Suporte a formatação de código, negrito, itálico, tabelas, imagens e citações.

## Tecnologias Utilizadas

- React
- TypeScript
- React Router
- React Markdown
- jsPDF
- Highlight.js/SyntaxHighlighter
- Nginx (produção)
- Docker