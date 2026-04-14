import React, { useEffect, useMemo, useState } from "react";
import { getMyIdeas } from "../../services/ideasApi";
import { createIdeaProgress, getIdeaProgress } from "../../services/ideaProgressApi";

const initialForm = {
  status: "inicial",
  progressPercentage: 0,
  goalsCompleted: "",
  nextSteps: "",
  revenue: 0,
  expenses: 0,
  investment: 0,
  totalClients: 0,
  newClients: 0,
  lostClients: 0,
  customerFeedback: "",
  marketingCampaigns: "",
  marketingChannels: "",
  marketingResults: "",
  weeklySummary: "",
  challenges: "",
  learnings: "",
};

const statusLabels = {
  inicial: "Inicial",
  validacao: "Validação",
  crescimento: "Crescimento",
  escala: "Escala",
};

function parseNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function IdeaProgress({ setModal }) {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const profit = useMemo(() => parseNumber(form.revenue) - parseNumber(form.expenses), [form.revenue, form.expenses]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const fetchedIdeas = await getMyIdeas();
        if (!mounted) return;
        setIdeas(fetchedIdeas || []);
        if ((fetchedIdeas || []).length > 0) {
          setSelectedIdeaId(String(fetchedIdeas[0].id));
        }
      } catch (err) {
        if (!mounted) return;
        setModal?.({ open: true, title: "Erro", message: `Falha ao carregar ideias: ${err.message}` });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setModal]);

  useEffect(() => {
    if (!selectedIdeaId) {
      setHistory([]);
      return;
    }
    let mounted = true;
    (async () => {
      setHistoryLoading(true);
      try {
        const rows = await getIdeaProgress(selectedIdeaId);
        if (!mounted) return;
        setHistory(rows || []);
      } catch (err) {
        if (!mounted) return;
        setModal?.({ open: true, title: "Erro", message: `Falha ao carregar histórico de progresso: ${err.message}` });
      } finally {
        if (mounted) setHistoryLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedIdeaId, setModal]);

  const handleInput = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleNumberInput = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: parseNumber(event.target.value, 0) }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!selectedIdeaId) {
      setModal?.({ open: true, title: "Atenção", message: "Selecione uma ideia para salvar o progresso." });
      return;
    }

    setSubmitting(true);
    try {
      await createIdeaProgress({
        ideaId: Number(selectedIdeaId),
        ...form,
        progressPercentage: parseNumber(form.progressPercentage, 0),
      });
      setModal?.({ open: true, title: "Sucesso", message: "Atualização semanal salva com sucesso." });
      setForm(initialForm);
      const rows = await getIdeaProgress(selectedIdeaId);
      setHistory(rows || []);
    } catch (err) {
      setModal?.({ open: true, title: "Erro", message: `Não foi possível salvar atualização: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="dashboard-card-title">Progresso da Ideia</h3>
          <p className="dashboard-card-description">Registe a evolução semanal e gere base para relatórios mensais.</p>
        </div>

        {loading ? (
          <p>A carregar ideias...</p>
        ) : ideas.length === 0 ? (
          <p>Você ainda não possui ideias submetidas para acompanhar progresso.</p>
        ) : (
          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Ideia</label>
              <select className="form-input" value={selectedIdeaId} onChange={(e) => setSelectedIdeaId(e.target.value)}>
                {ideas.map((idea) => (
                  <option key={idea.id} value={idea.id}>
                    {idea.title}
                  </option>
                ))}
              </select>
            </div>

            <h4 style={{ margin: "8px 0 0", color: "#1f2937" }}>1. Progresso da Ideia</h4>
            <div className="form-group">
              <label className="form-label">Status da ideia</label>
              <select className="form-input" value={form.status} onChange={handleInput("status")}>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Percentual de progresso (0-100)</label>
              <input className="form-input" type="number" min="0" max="100" value={form.progressPercentage} onChange={handleNumberInput("progressPercentage")} />
            </div>
            <div className="form-group">
              <label className="form-label">Metas atingidas</label>
              <textarea className="form-input" rows="3" value={form.goalsCompleted} onChange={handleInput("goalsCompleted")} />
            </div>
            <div className="form-group">
              <label className="form-label">Próximos passos</label>
              <textarea className="form-input" rows="3" value={form.nextSteps} onChange={handleInput("nextSteps")} />
            </div>

            <h4 style={{ margin: "8px 0 0", color: "#1f2937" }}>2. Financeiro</h4>
            <div className="form-group">
              <label className="form-label">Receita do período</label>
              <input className="form-input" type="number" min="0" value={form.revenue} onChange={handleNumberInput("revenue")} />
            </div>
            <div className="form-group">
              <label className="form-label">Despesas do período</label>
              <input className="form-input" type="number" min="0" value={form.expenses} onChange={handleNumberInput("expenses")} />
            </div>
            <div className="form-group">
              <label className="form-label">Lucro (automático)</label>
              <input className="form-input" value={profit.toFixed(2)} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Investimento recebido</label>
              <input className="form-input" type="number" min="0" value={form.investment} onChange={handleNumberInput("investment")} />
            </div>

            <h4 style={{ margin: "8px 0 0", color: "#1f2937" }}>3. Clientes</h4>
            <div className="form-group">
              <label className="form-label">Número de clientes atuais</label>
              <input className="form-input" type="number" min="0" value={form.totalClients} onChange={handleNumberInput("totalClients")} />
            </div>
            <div className="form-group">
              <label className="form-label">Novos clientes na semana</label>
              <input className="form-input" type="number" min="0" value={form.newClients} onChange={handleNumberInput("newClients")} />
            </div>
            <div className="form-group">
              <label className="form-label">Clientes perdidos</label>
              <input className="form-input" type="number" min="0" value={form.lostClients} onChange={handleNumberInput("lostClients")} />
            </div>
            <div className="form-group">
              <label className="form-label">Feedback dos clientes</label>
              <textarea className="form-input" rows="3" value={form.customerFeedback} onChange={handleInput("customerFeedback")} />
            </div>

            <h4 style={{ margin: "8px 0 0", color: "#1f2937" }}>4. Marketing</h4>
            <div className="form-group">
              <label className="form-label">Campanhas realizadas</label>
              <textarea className="form-input" rows="3" value={form.marketingCampaigns} onChange={handleInput("marketingCampaigns")} />
            </div>
            <div className="form-group">
              <label className="form-label">Canais utilizados</label>
              <input className="form-input" value={form.marketingChannels} onChange={handleInput("marketingChannels")} />
            </div>
            <div className="form-group">
              <label className="form-label">Resultados</label>
              <textarea className="form-input" rows="3" value={form.marketingResults} onChange={handleInput("marketingResults")} />
            </div>

            <h4 style={{ margin: "8px 0 0", color: "#1f2937" }}>5. Atualização Semanal</h4>
            <div className="form-group">
              <label className="form-label">O que foi feito esta semana</label>
              <textarea className="form-input" rows="3" value={form.weeklySummary} onChange={handleInput("weeklySummary")} />
            </div>
            <div className="form-group">
              <label className="form-label">Principais dificuldades</label>
              <textarea className="form-input" rows="3" value={form.challenges} onChange={handleInput("challenges")} />
            </div>
            <div className="form-group">
              <label className="form-label">Aprendizados</label>
              <textarea className="form-input" rows="3" value={form.learnings} onChange={handleInput("learnings")} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar Atualização"}
            </button>
          </form>
        )}
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="dashboard-card-title">Histórico Semanal</h3>
          <p className="dashboard-card-description">Últimas atualizações guardadas para a ideia selecionada.</p>
        </div>

        {historyLoading ? (
          <p>A carregar histórico...</p>
        ) : history.length === 0 ? (
          <p>Sem atualizações semanais para esta ideia.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Status</th>
                <th>Progresso</th>
                <th>Lucro</th>
                <th>Novos Clientes</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id}>
                  <td>{new Date(row.created_at).toLocaleDateString("pt-PT")}</td>
                  <td>{statusLabels[row.status] || row.status}</td>
                  <td>{Number(row.progress_percentage || 0).toFixed(0)}%</td>
                  <td>{Number(row.profit || 0).toFixed(2)} Kz</td>
                  <td>{row.new_clients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
