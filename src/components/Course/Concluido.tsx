import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockCourses } from "@/constants/courses";

export default function Concluido() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = mockCourses.find(c => String(c.id) === id);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f7f7fa"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 16px #0002",
        padding: 48,
        maxWidth: 480,
        textAlign: "center"
      }}>
        <h1 className="text-3xl font-bold mb-4">Parabéns! 🎉</h1>
        <p className="text-lg mb-6">
          Você concluiu o curso <b>{course?.title || "Curso"}</b>.<br />
          Continue aprendendo e evoluindo!
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded text-lg font-semibold"
          onClick={() => navigate("/courses")}
        >
          Voltar para seleção de cursos
        </button>
      </div>
    </div>
  );
}