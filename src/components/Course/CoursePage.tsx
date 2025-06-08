import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockCourses } from "@/constants/courses";
import { mockTutorials } from "@/constants/tutorials";
import { Badge } from "@/components/ui/badge";

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = mockCourses.find(c => String(c.id) === id);

  if (!course) {
    return <div className="p-8 text-center text-red-500">Curso não encontrado.</div>;
  }

  const firstTutorialId = course.tutorials && course.tutorials.length > 0 ? course.tutorials[0] : null;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <div className="flex gap-2 mb-4">
        <Badge variant="secondary">{course.tool}</Badge>
        <Badge variant="outline">{course.level}</Badge>
        {course.trilha && <Badge variant="default">{course.trilha}</Badge>}
      </div>
      <div className="mb-6 text-gray-700">{course.description}</div>
      {firstTutorialId && (
        <button
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate(`/classroom/${course.id}/${firstTutorialId}`)}
        >
          Ir para o curso
        </button>
      )}
      <h2 className="text-xl font-semibold mb-2">Estrutura do Curso</h2>
      <ol className="list-decimal ml-6 space-y-2">
        {course.tutorials && course.tutorials.map((tid: string) => {
          const tut = mockTutorials.find(t => t.id === tid);
          return tut ? (
            <li key={tid}>
              <span className="font-semibold">{tut.title}</span>
              <div className="text-xs text-gray-500">{tut.description}</div>
            </li>
          ) : null;
        })}
      </ol>
    </div>
  );
}