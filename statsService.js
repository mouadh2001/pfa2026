export class StatsService {
  constructor(levelKey = null) {
    this.levelKey = levelKey;
    this.stats = {
      correct: 0,
      incorrect: 0,
      score: 0,
      time: 0,
    };

    this.metrics = {
      observationTime: 0,
      averageResponseTime: 0,
      firstTrySuccessCount: 0,
      levelAttempts: 1,
      sessionDuration: 0,
    };

    this.questionStats = {};
    this.currentQuestionId = null;
    this.gameStartTime = Date.now();
  }

  // Observation Timer (Tumor Viewer)
  startObservationTimer() {
    this.observationStart = Date.now();
  }

  stopObservationTimer() {
    if (this.observationStart) {
      this.metrics.observationTime += Number(((Date.now() - this.observationStart) / 1000).toFixed(1));
      this.observationStart = null;
    }
  }

  // Level Attempts Logic (Player deaths/restarts within the same level)
  addLevelAttempt() {
    this.metrics.levelAttempts++;
  }

  // Call this when a new question starts
  startQuestion(id) {
    if (!this.questionStats[id]) {
      this.questionStats[id] = {
        attempts: 0,
        solved: false,
        correctSelections: 0,
        incorrectSelections: 0,
        timeSpent: 0,
        firstTrySuccess: false
      };
    }
    this.currentQuestionId = id;
    this.questionStartTime = Date.now();
  }

  recordSelectionTime() {
    if (this.questionStartTime) {
      const qStats = this.questionStats[this.currentQuestionId];
      if (qStats && qStats.correctSelections === 0 && qStats.incorrectSelections === 0) {
        qStats.timeSpent += Number(((Date.now() - this.questionStartTime) / 1000).toFixed(1));
      }
      this.questionStartTime = null; // Prevent adding time to subsequent clicks in same session
    }
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

      if (attempts === 1 && this.questionStats[qId].incorrectSelections === 0) {
         this.questionStats[qId].firstTrySuccess = true;
         this.metrics.firstTrySuccessCount++;
      }
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
    this.recordSelectionTime();
    const qId = id || this.currentQuestionId;
    if (!this.questionStats[qId]) this.startQuestion(qId);
    this.questionStats[qId].correctSelections++;
  }

  addIncorrectSelection(id) {
    this.recordSelectionTime();
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
      this.metrics.sessionDuration = this.getStats().time;

      let totalRespTime = 0;
      let questionsAnswered = 0;
      for (const data of Object.values(this.questionStats)) {
        if (data.timeSpent > 0) {
          totalRespTime += data.timeSpent;
          questionsAnswered++;
        }
      }
      this.metrics.averageResponseTime = questionsAnswered > 0 ? Number((totalRespTime / questionsAnswered).toFixed(2)) : 0;

      const payload = {
          levelKey: this.levelKey,
          score: finalStats.score,
          correct: finalStats.correct,
          incorrect: finalStats.incorrect,
          time: finalStats.time,
          metrics: this.metrics,
          questionStats: this.getQuestionStats(),
      };

      const response = await fetch(`${API_URL}/stats`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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
        wrong: data.incorrectSelections || 0,
        timeSpent: data.timeSpent || 0,
        firstTrySuccess: data.firstTrySuccess || false
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
