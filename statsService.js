export class StatsService {
  constructor(levelKey = null) {
    this.levelKey = levelKey;
    this.stats = {
      correct: 0,
      incorrect: 0,
      score: 0,
      time: 0,
    };

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
        correctSelections: 0,
        incorrectSelections: 0,
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

  addCorrectSelection(id) {
    const qId = id || this.currentQuestionId;
    if (!this.questionStats[qId]) this.startQuestion(qId);
    this.questionStats[qId].correctSelections++;
  }

  addIncorrectSelection(id) {
    const qId = id || this.currentQuestionId;
    if (!this.questionStats[qId]) this.startQuestion(qId);
    this.questionStats[qId].incorrectSelections++;
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          levelKey: this.levelKey,
          score: finalStats.score,
          correct: finalStats.correct,
          incorrect: finalStats.incorrect,
          time: finalStats.time,
          questionStats: this.getQuestionStats(),
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
    const formattedStats = {};
    for (const [qId, data] of Object.entries(this.questionStats)) {
      formattedStats[qId] = {
        correct: data.correctSelections || 0,
        wrong: data.incorrectSelections || 0
      };
    }
    return formattedStats;
  }

  getQuestionStatsFor(id) {
    return (
      this.questionStats[id] || {
        attempts: 0,
        solved: false,
        correctSelections: 0,
        incorrectSelections: 0,
      }
    );
  }

  getScore() {
    return this.stats.score;
  }
}
