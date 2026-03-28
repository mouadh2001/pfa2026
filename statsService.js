export class StatsService {
  constructor() {
    this.stats = {
      correct: 0,
      incorrect: 0,
      score: 0,
      time: 0,
    };

    // Tracks individual question attempts only
    this.questionStats = {};
    this.currentQuestionId = null;
    this.gameStartTime = Date.now();
  }

  // Call this when a new question starts
  startQuestion(id) {
    if (!this.questionStats[id]) {
      this.questionStats[id] = {
        attempts: 0,
        solved: false,
      };
    }
    this.currentQuestionId = id;
  }

  // Call on wrong answer
  addIncorrect(id) {
    const qId = id || this.currentQuestionId;
    if (this.questionStats[qId] && !this.questionStats[qId].solved) {
      this.questionStats[qId].attempts++;
    }

    this.stats.incorrect++;
    console.log(
      `❌ ${qId} Incorrect, total attempts: ${this.questionStats[qId]?.attempts}`,
      this.getStats(),
    );
  }

  // Call on correct answer
  addCorrect(id) {
    const qId = id || this.currentQuestionId;
    let attempts = 1;

    if (this.questionStats[qId] && !this.questionStats[qId].solved) {
      this.questionStats[qId].attempts++;
      attempts = this.questionStats[qId].attempts;
      this.questionStats[qId].solved = true;
    }

    let points = this.calculatePoints(attempts);

    this.stats.correct++;
    this.stats.score += points;

    console.log(
      `✅ ${qId} Correct in ${attempts} attempt(s) → +${points} pts`,
      this.getStats(),
    );
  }

  calculatePoints(attempt) {
    if (attempt <= 1) return 5;
    if (attempt === 2) return 4;
    if (attempt === 3) return 3;
    if (attempt === 4) return 2;
    return 1; // 5 or more
  }

  async pushStats() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, unable to push stats.");
      return;
    }

    const API_URL = "https://pathquestadmin.onrender.com/api/player";
    const finalStats = this.getStats();

    try {
      const response = await fetch(`${API_URL}/stats`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: finalStats.score,
          correct: finalStats.correct,
          incorrect: finalStats.incorrect,
          time: finalStats.time,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Stats successfully pushed to DB:", data);
    } catch (err) {
      console.error("Failed to push stats to DB:", err);
    }
  }

  getStats() {
    // Calculate full time played right when stats are requested, in seconds.
    this.stats.time = Number(
      ((Date.now() - this.gameStartTime) / 1000).toFixed(1),
    );
    return this.stats;
  }

  getQuestionStats() {
    return this.questionStats;
  }

  getScore() {
    return this.stats.score;
  }
}
