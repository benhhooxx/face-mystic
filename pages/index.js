import { useState, useEffect } from "react";

export default function Home() {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false); // 控制結果顯示漸變

  const calculate = async (e) => {
    e.preventDefault();
    setError("");
    setShowResult(false); // 先淡出結果區
    setResult(null);

    if (!gender) return setError("請選擇性別");
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 99)
      return setError("請輸入1-99");

    setLoading(true);

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, age: ageNum }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      // 延遲顯示結果以配合動畫
      setTimeout(() => {
        setResult(data);
        setShowResult(true); // 淡入結果區
        setLoading(false);
      }, 300);
    } catch {
      setError("計算過程中發生錯誤，請稍後再試");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-100 via-gray-50 to-white flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full bg-white bg-opacity-25 backdrop-blur-md border border-white border-opacity-20 rounded-3xl shadow-2xl p-12 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
            🔮 面相流年計算機
          </h1>
          <p className="mt-2 text-gray-700 font-semibold tracking-wider">
            九澤面相 & 百歲流年
          </p>
        </header>

        <form onSubmit={calculate} className="space-y-6">
          <fieldset className="flex justify-center gap-8 mb-4">
            {["男", "女"].map((g) => (
              <button
                key={g}
                type="button"
                className={`rounded-full w-[180px] px-9 py-3 text-lg font-semibold transition-transform duration-300 select-none cursor-pointer
                ${
                  gender === g
                    ? g === "男"
                      ? "bg-blue-400 text-white shadow-md scale-110 ring-2 ring-blue-300"
                      : "bg-pink-400 text-white shadow-md scale-110 ring-2 ring-pink-300"
                    : g === "男"
                    ? "bg-blue-200 text-blue-700 hover:scale-105 hover:bg-blue-300 shadow-sm"
                    : "bg-pink-200 text-pink-700 hover:scale-105 hover:bg-pink-300 shadow-sm"
                }
              `}
                onClick={() => setGender(g)}
              >
                {g === "男" ? "👨 男" : "👩 女"}
              </button>
            ))}
          </fieldset>

          <div>
            <input
              type="number"
              min={1}
              max={99}
              placeholder="年齡 (1-99)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-xl border border-white border-opacity-30 bg-white bg-opacity-40 text-gray-900 placeholder-gray-500 text-2xl font-semibold focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm transition-all px-6 py-4"
            />
          </div>

          {error && (
            <p className="text-center text-red-600 font-semibold animate-pulse">
              {error}
            </p>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full px-12 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-xl font-bold shadow-xl hover:scale-105 transform transition-transform duration-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  計算中...
                </>
              ) : (
                <span>✨ 開始計算</span>
              )}
            </button>
          </div>
        </form>

        <section
          aria-live="polite"
          className={`bg-white bg-opacity-30 backdrop-blur-md border border-white border-opacity-20 rounded-2xl p-8 shadow-lg space-y-6 transition-opacity duration-500 ${
            showResult ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {result && (
            <>
              <h2 className="text-2xl font-bold tracking-wide text-gray-900">
                {result.gender}性 {result.age}歲 - 計算結果
              </h2>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 tracking-wide mb-2 flex items-center gap-2">
                  <span>📊</span> 九澤面相
                </h3>
                <p className="font-mono text-sm text-gray-700 mb-1">
                  {(result.jiuze?.process ?? []).join(" → ")}
                </p>
                <p className="text-xl font-extrabold text-indigo-700">
                  {result.jiuze?.part ?? ""}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 tracking-wide mb-2 flex items-center gap-2">
                  <span>🏛️</span> 傳統百歲流年
                </h3>
                <p className="text-xl font-extrabold text-indigo-900">
                  {result.traditional?.part ?? ""}
                </p>
              </div>
            </>
          )}
        </section>
      </div>

      <style jsx global>{`
        .backdrop-blur-md {
          backdrop-filter: saturate(180%) blur(20px);
        }
        .animate-fadein {
          animation: fadein 0.8s ease forwards;
        }
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
