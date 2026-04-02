import { level1Questions } from "./level1Questions.js";
import { level2Questions } from "./level2Questions.js";

export const LEVELS = {
  level1: {
    key: "level1",
    title: "Level 1",
    backgroundKey: "bg",
    spawn: { x: 100, y: 500 },
    questionData: level1Questions,
    sequence: ["q1", "q2", "q3", "q4", "q5", "q6", "q7"],
    platforms: [
      { x: 400, y: 100, width: 150, height: 20, id: "q1" },
      { x: 700, y: 130, width: 150, height: 20, id: "q2" },
      { x: 1200, y: 100, width: 150, height: 20, id: "q3" },
      { x: 950, y: 300, width: 150, height: 20, id: "loupe" },
      {
        x: 150,
        y: 130,
        width: 150,
        height: 20,
        id: "pass",
        movement: {
          type: "raise",
          targetHeightAboveFloor: 190,
          step: 30,
        },
      },
      { x: 530, y: 300, width: 400, height: 20, id: "enemy" },
      { x: 200, y: 410, width: 400, height: 20, id: "q4" },
      { x: 800, y: 410, width: 150, height: 20, id: "q5" },
      { x: 950, y: 410, width: 150, height: 20, id: "void" },
      { x: 1175, y: 410, width: 300, height: 20, id: "q7" },
      { x: 870, y: 155, width: 20, height: 310, id: "block" },
    ],
    items: [
      { type: "scope", x: 550, y: 50, questionId: "q1" },
      { type: "scope", x: 700, y: 170, questionId: "q2" },
      { type: "scope", x: 100, y: 450, questionId: "q3" },
      { type: "scope", x: 800, y: 450, questionId: "q4" },
      { type: "scope", x: 1250, y: 450, questionId: "q5" },
      { type: "scope", x: 950, y: 340, questionId: "q6" },
      { type: "scopeLoop", x: 1200, y: 140, questionId: "q7" },
      { type: "loupe", x: 400, y: 140 },
      { type: "loupe", x: 1200, y: 30 },
    ],
    enemies: [
      { x: 530, y: 330, range: 400, speed: 100, name: "E1" },
      { x: 500, y: 40, range: 700, speed: 100, name: "E2" },
      { x: 210, y: 440, range: 400, speed: 100, name: "E3" },
      { x: 1020, y: 440, range: 550, speed: 100, name: "E4" },
      { x: 1100, y: 40, range: 400, speed: 100, name: "E5" },
    ],
  },
  level2: {
    key: "level2",
    title: "Level 2",
    backgroundKey: "bg",
    spawn: { x: 120, y: 100 },
    questionData: level2Questions,
    sequence: ["q1", "q2", "q3", "q4", "q5", "q6", "q7"],
    platforms: [
      { x: 1195, y: 120, width: 150, height: 20, id: "q4" }, //q4
      { x: 1095, y: 450, width: 150, height: 20, id: "q7" }, //
      { x: 1095, y: 230, width: 150, height: 20, id: "q5" }, //
      {
        x: 470,
        y: 260,
        width: 200,
        height: 20,
        id: "elevator",
        movement: {
          type: "elevator",
          minHeightAboveFloor: 120,
          maxHeightAboveFloor: 400,
          speed: 60,
        },
      },
      { x: 925, y: 260, width: 150, height: 20, id: "q6" },
      { x: 750, y: 400, width: 150, height: 20, id: "loupe" },
      { x: 170, y: 250, width: 150, height: 20, id: "q2" }, //q2
      { x: 850, y: 150, width: 300, height: 20, id: "q5" }, //
      { x: 1195, y: 340, width: 150, height: 20, id: "none" }, //
      { x: 120, y: 120, width: 250, height: 20, id: "q1" }, //q1
      { x: 120, y: 400, width: 250, height: 20, id: "q3" }, //q3
      { x: 1010, y: 300, width: 20, height: 320, id: "block" },
    ],
    items: [
      { type: "scope", x: 150, y: 160, questionId: "q1" },
      { type: "scope", x: 150, y: 290, questionId: "q2" },
      { type: "scope", x: 150, y: 440, questionId: "q3" },
      { type: "scope", x: 970, y: 190, questionId: "q4" },
      { type: "scope", x: 970, y: 300, questionId: "q5" },
      { type: "scope", x: 1180, y: 160, questionId: "q6" },
      { type: "scopeLoop", x: 1100, y: 490, questionId: "q7" },
      { type: "loupe", x: 745, y: 440 },
    ],
    enemies: [
      { x: 600, y: 50, range: 380, speed: 110, name: "E1" },
      { x: 1020, y: 50, range: 300, speed: 90, name: "E2" },
      { x: 780, y: 50, range: 240, speed: 80, name: "E3" },
    ],
  },
};
