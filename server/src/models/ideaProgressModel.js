import { pool } from "../config/db.js";

export async function createIdeaProgress(data) {
  const [result] = await pool.execute(
    `INSERT INTO idea_progress
      (user_id, idea_id, status, progress_percentage, goals_completed, next_steps,
       revenue, expenses, investment, total_clients, new_clients, lost_clients,
       customer_feedback, marketing_campaigns, marketing_channels, marketing_results,
       weekly_summary, challenges, learnings)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.userId,
      data.ideaId,
      data.status,
      data.progressPercentage,
      data.goalsCompleted,
      data.nextSteps,
      data.revenue,
      data.expenses,
      data.investment,
      data.totalClients,
      data.newClients,
      data.lostClients,
      data.customerFeedback,
      data.marketingCampaigns,
      data.marketingChannels,
      data.marketingResults,
      data.weeklySummary,
      data.challenges,
      data.learnings,
    ]
  );

  return findIdeaProgressById(result.insertId);
}

export async function listIdeaProgressByIdea(ideaId) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, idea_id, status, progress_percentage, goals_completed, next_steps,
            revenue, expenses, (revenue - expenses) AS profit, investment, total_clients,
            new_clients, lost_clients, customer_feedback, marketing_campaigns,
            marketing_channels, marketing_results, weekly_summary, challenges, learnings,
            created_at
     FROM idea_progress
     WHERE idea_id = ?
     ORDER BY created_at DESC, id DESC`,
    [ideaId]
  );
  return rows;
}

export async function findIdeaProgressById(id) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, idea_id, status, progress_percentage, goals_completed, next_steps,
            revenue, expenses, (revenue - expenses) AS profit, investment, total_clients,
            new_clients, lost_clients, customer_feedback, marketing_campaigns,
            marketing_channels, marketing_results, weekly_summary, challenges, learnings,
            created_at
     FROM idea_progress
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}
