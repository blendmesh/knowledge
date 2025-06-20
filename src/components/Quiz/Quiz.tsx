import React, { useState, useEffect } from "react";

type QuizQuestion = {
    id: string;
    type: "multiple" | "truefalse";
    question: string;
    options?: string[];
    correct: string | boolean;
};

type QuizProps = {
    questions: QuizQuestion[];
    onFinish?: (result: QuizResult) => void;
};

type QuizResult = {
    total: number;
    correct: number;
    percent: number;
    approved: boolean;
    answers: {
        id: string;
        question: string;
        userAnswer: string | boolean;
        correctAnswer: string | boolean;
        correct: boolean;
        time: number;
    }[];
    totalTime: number;
};

const formatTime = (s: number) =>
    `${Math.floor(s / 60)
        .toString()
        .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

export default function Quiz({ questions, onFinish }: QuizProps) {
    const [started, setStarted] = useState(false);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<
        { answer: string | boolean; time: number }[]
    >([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [questionStart, setQuestionStart] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [finished, setFinished] = useState(false);
    const [finishCalled, setFinishCalled] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // Cronômetro global
    useEffect(() => {
        if (!started || finished || !startTime) return;
        const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
        return () => clearInterval(timer);
    }, [startTime, started, finished]);

    // Avançar para próxima questão
    const handleAnswer = (answer: string | boolean) => {
        if (!questionStart) return;
        const now = Date.now();
        setAnswers((prev) => [
            ...prev,
            { answer, time: Math.floor((now - questionStart) / 1000) },
        ]);
        if (current < questions.length - 1) {
            setSelectedOption(null); 
            setCurrent(current + 1);
            setQuestionStart(now);
        } else {
            setFinished(true);
        }
    };

    // Relatório final
    const result: QuizResult = React.useMemo(() => {
        let correct = 0;
        const report = questions.map((q, i) => {
            const userAnswer = answers[i]?.answer;
            const isCorrect =
                q.type === "multiple"
                    ? userAnswer === q.correct
                    : String(userAnswer) === String(q.correct);
            if (isCorrect) correct++;
            return {
                id: q.id,
                question: q.question,
                userAnswer: userAnswer ?? "",
                correctAnswer: q.correct,
                correct: isCorrect,
                time: answers[i]?.time ?? 0,
            };
        });
        const percent = questions.length
            ? Math.round((correct / questions.length) * 100)
            : 0;
        return {
            total: questions.length,
            correct,
            percent,
            approved: percent >= 70,
            answers: report,
            totalTime: answers.reduce((a, b) => a + (b.time || 0), 0),
        };
    }, [answers, questions]);

    // Exportar resultado
    const handleExport = () => {
        const blob = new Blob([JSON.stringify(result, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quiz_result.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    // Função para refazer o quiz
    const handleRetry = () => {
        setCurrent(0);
        setAnswers([]);
        setStartTime(null);
        setQuestionStart(null);
        setElapsed(0);
        setFinished(false);
        setStarted(false);
        setFinishCalled(false);
    };

    // Chama o onFinish apenas quando aprovado e clicar no botão
    const handleFinish = () => {
        if (onFinish && !finishCalled) {
            onFinish(result);
            setFinishCalled(true);
        }
    };

    

    if (!questions.length) return <div>Nenhuma questão disponível.</div>;

    return (
        <div className="quiz bg-white rounded shadow p-6 max-w-xl mx-auto">
            {!started ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Quiz</h2>
                    <p className="mb-4">Clique no botão abaixo para iniciar o teste. O tempo começará a ser contado a partir do início.</p>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => {
                            setStarted(true);
                            const now = Date.now();
                            setStartTime(now);
                            setQuestionStart(now);
                        }}
                    >
                        Iniciar Quiz
                    </button>
                </div>
            ) : finished ? (
                <div className="quiz-report text-center">
                    <h2 className="text-xl font-bold mb-2">Resumo do Quiz</h2>
                    <div className="mb-2">Tempo total: <b>{formatTime(result.totalTime)}</b></div>
                    <div className="mb-2">Acertos: <b>{result.correct} / {result.total}</b> ({result.percent}%)</div>
                    <div className="mb-2">
                        Status:{" "}
                        <span className={result.approved ? "text-green-600" : "text-red-600"}>
                            {result.approved ? "Aprovado" : "Reprovado"}
                        </span>
                    </div>
                    <table className="w-full text-sm my-4 border">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1">Questão</th>
                                <th className="border px-2 py-1">Sua resposta</th>
                                <th className="border px-2 py-1">Correta?</th>
                                <th className="border px-2 py-1">Tempo (s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.answers.map((a, i) => (
                                <tr key={a.id}>
                                    <td className="border px-2 py-1">{a.question}</td>
                                    <td className="border px-2 py-1">{String(a.userAnswer)}</td>
                                    <td className="border px-2 py-1" style={{ color: a.correct ? "#16a34a" : "#dc2626" }}>
                                        {a.correct ? "✔" : "✘"}
                                    </td>
                                    <td className="border px-2 py-1">{a.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                        onClick={handleExport}
                    >
                        Exportar resultado
                    </button>
                    {result.approved && (
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded ml-2"
                            onClick={handleFinish}
                            disabled={finishCalled}
                        >
                            Finalizar Quiz
                        </button>
                    )}
                    {!result.approved && (
                        <button
                            className="bg-yellow-600 text-white px-4 py-2 rounded ml-2"
                            onClick={handleRetry}
                        >
                            Refazer Quiz
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            Questão {current + 1} de {questions.length}
                        </div>
                        <div>
                            Tempo: <b>{formatTime(elapsed)}</b>
                        </div>
                    </div>
                    <div className="mb-4 font-semibold">{questions[current].question}</div>
                    {questions[current].type === "multiple" && questions[current].options && (
                        <div className="space-y-2">
                            {questions[current].options.map((opt, i) => (
                                <label key={i} className="block">
                                    <input
                                        type="radio"
                                        name={`q${current}`}
                                        value={opt}
                                        onChange={() => handleAnswer(opt)}
                                        checked={selectedOption === opt}
                                        disabled={answers.length > current}
                                        className="mr-2"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    )}
                    {questions[current].type === "truefalse" && (
                        <div className="space-y-2">
                            <label className="block">
                                <input
                                    type="radio"
                                    name={`q${current}`}
                                    value="true"
                                    onChange={() => handleAnswer(true)}
                                    disabled={answers.length > current}
                                    className="mr-2"
                                />
                                Verdadeiro
                            </label>
                            <label className="block">
                                <input
                                    type="radio"
                                    name={`q${current}`}
                                    value="false"
                                    onChange={() => handleAnswer(false)}
                                    disabled={answers.length > current}
                                    className="mr-2"
                                />
                                Falso
                            </label>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}