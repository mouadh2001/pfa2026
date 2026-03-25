export class StatsService {
  constructor() {
    this.stats = {
      correct: 0,
      incorrect: 0,
      score: 0,
    };

    this.currentAttempts = 0; // 🔥 track attempts per question
  }

  // Call this when a new question starts
  startQuestion() {
    this.currentAttempts = 0;
  }

  // Call on wrong answer
  addIncorrect() {
    this.currentAttempts++;
    this.stats.incorrect++;

    console.log("❌ Stats:", this.stats, "Attempts:", this.currentAttempts);
  }

  // Call on correct answer
  addCorrect() {
    this.currentAttempts++;

    let points = this.calculatePoints(this.currentAttempts);

    this.stats.correct++;
    this.stats.score += points;

    console.log(
      `✅ Correct in ${this.currentAttempts} attempt(s) → +${points} pts`,
      this.stats,
    );

    // Reset for next question
    this.currentAttempts = 0;
  }

  calculatePoints(attempt) {
    if (attempt <= 1) return 5;
    if (attempt === 2) return 4;
    if (attempt === 3) return 3;
    if (attempt === 4) return 2;
    return 1; // 5 or more
  }

  getStats() {
    return this.stats;
  }
  getScore() {
    console.log(this.stats.score);
    return this.stats.score;
  }
}
