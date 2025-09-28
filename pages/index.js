// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (e) => {
    e.preventDefault();
    setError(''); setResult(null);
    if (!gender) return setError('請選擇性別');
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) return setError('請輸入1-120之間年齡');

    setLoading(true);
    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gender, age: ageNum })
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) setError(data.error);
    else setResult(data);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">面相流年計算機</h1>
      <form onSubmit={calculate} className="mb-4">
        <div className="mb-3">
          <label className="form-label">性別</label><br />
          {['男', '女'].map(g => (
            <button
              key={g}
              type="button"
              className={`btn me-2 ${gender === g ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setGender(g)}
            >{g}</button>
          ))}
        </div>
        <div className="mb-3">
          <label className="form-label">年齡</label>
          <input
            type="number" className="form-control" value={age}
            onChange={e => setAge(e.target.value)} min="1" max="120"
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? '計算中...' : '開始計算'}
        </button>
      </form>

      {result && (
        <div className="card">
          <div className="card-header">
            {result.gender}性 {result.age}歲 - 計算結果
          </div>
          <div className="card-body">
            <h5>📊 九澤面相</h5>
            <p className="text-muted">
              {(result.jiuze?.process ?? []).join(' → ')}
            </p>
            <p><strong>{result.jiuze.part}</strong></p>
            <hr />
            <h5>🏛️ 傳統百歲流年</h5>
            <p><strong>{result.traditional.part}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}
