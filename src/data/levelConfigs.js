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
    spawn: { x: 100, y: 100 },
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
      { x: 400, y: 200, range: 700, speed: 100, name: "E1" },
      { x: 600, y: 350, range: 700, speed: 100, name: "E2" },
      { x: 680, y: 50, range: 1000, speed: 100, name: "E3" },
    ],
  },
  level3: {
    key: "level3",
    title: "Level 3",
    backgroundKey: "bg",
    spawn: { x: 70, y: 300 },
    questionData: level2Questions,
    sequence: ["q1", "q2", "q3", "q4", "q5", "q6", "q7"],
    platforms: [
      { x: 80, y: 120, width: 150, height: 20, id: "q1" }, //q1
      { x: 280, y: 230, width: 150, height: 20, id: "q2" }, //q2
      { x: 500, y: 340, width: 150, height: 20, id: "q3" }, //q3
      { x: 850, y: 340, width: 150, height: 20, id: "q4" }, //q4
      { x: 950, y: 150, width: 150, height: 20, id: "q5" }, //q5
      { x: 650, y: 150, width: 150, height: 20, id: "q6" }, //q6
      { x: 1050, y: 450, width: 150, height: 20, id: "q7" }, //q7
    ],
    items: [
      { type: "scope", x: 120, y: 160, questionId: "q1" },
      { type: "scope", x: 320, y: 270, questionId: "q2" },
      { type: "scope", x: 470, y: 380, questionId: "q3" },
      { type: "scope", x: 890, y: 380, questionId: "q4" },
      { type: "scope", x: 990, y: 190, questionId: "q5" },
      { type: "scope", x: 690, y: 190, questionId: "q6" },
      { type: "scopeLoop", x: 1040, y: 490, questionId: "q7" },
      { type: "loupe", x: 745, y: 40 },
    ],
    enemies: [
      {
        x: 400,
        y: 200,
        range: 300,
        speed: 120,
        name: "E1",
        type: "follower",
        aggroRange: 350,
      },
      {
        x: 600,
        y: 350,
        range: 300,
        speed: 120,
        name: "E2",
        type: "follower",
        aggroRange: 350,
      },
      {
        x: 680,
        y: 50,
        range: 1000,
        speed: 120,
        name: "E3",
        type: "follower",
        aggroRange: 350,
      },
    ],
  },
  level4: {
    key: "level4",
    title: "Level 4",
    backgroundKey: "bg",
    isDeadlyFloor: true,
    spawn: { x: 650, y: 100 },
    questionData: level2Questions,
    sequence: ["q1", "q2", "q3", "q4", "q5", "q6", "q7"],
    platforms: [
      {
        x: 200,
        y: 150,
        width: 100,
        height: 20,
        id: "elevator",
        movement: {
          type: "horizontal_elevator",
          minX: 150,
          maxX: 1100,
          speed: 120,
        },
      },
      {
        x: 970,
        y: 300,
        width: 100,
        height: 20,
        id: "elevator",
        movement: {
          type: "horizontal_elevator",
          minX: 150,
          maxX: 1100,
          speed: 120,
        },
      },
      {
        x: 250,
        y: 260,
        width: 100,
        height: 20,
        id: "elevator",
        movement: {
          type: "elevator",
          minHeightAboveFloor: 120,
          maxHeightAboveFloor: 400,
          speed: 120,
        },
      },
      {
        x: 1000,
        y: 260,
        width: 100,
        height: 20,
        id: "elevator",
        movement: {
          type: "elevator",
          minHeightAboveFloor: 120,
          maxHeightAboveFloor: 400,
          speed: 120,
        },
      },
      { x: 50, y: 50, width: 100, height: 20, id: "q1" }, //q1
      { x: 50, y: 250, width: 100, height: 20, id: "q2" }, //q2
      { x: 50, y: 450, width: 100, height: 20, id: "q3" }, //q3
      { x: 1250, y: 50, width: 100, height: 20, id: "q4" }, //q4
      { x: 1250, y: 250, width: 100, height: 20, id: "q5" }, //q5
      { x: 1250, y: 450, width: 100, height: 20, id: "q6" }, //q6
      { x: 650, y: 400, width: 100, height: 20, id: "q7" }, //q7
      { x: 650, y: 80, width: 100, height: 20, id: "q7" }, //q7
    ],
    items: [
      { type: "scope", x: 70, y: 90, questionId: "q1" },
      { type: "scope", x: 70, y: 290, questionId: "q2" },
      { type: "scope", x: 70, y: 490, questionId: "q3" },
      { type: "scope", x: 1280, y: 90, questionId: "q4" },
      { type: "scope", x: 1280, y: 290, questionId: "q5" },
      { type: "scope", x: 1280, y: 490, questionId: "q6" },
      { type: "scopeLoop", x: 1100, y: 490, questionId: "q7" },
      { type: "loupe", x: 650, y: 120 },
    ],
    enemies: [
      {
        x: 400,
        y: 200,
        range: 300,
        speed: 90,
        name: "E1",
        type: "follower",
        aggroRange: 350,
      },
      {
        x: 600,
        y: 350,
        range: 300,
        speed: 90,
        name: "E2",
        type: "follower",
        aggroRange: 350,
      },
      {
        x: 680,
        y: 50,
        range: 1000,
        speed: 90,
        name: "E3",
        type: "follower",
        aggroRange: 350,
      },
    ],
  },
  level5: {
    key: "level5  ",
    title: "Level 5",
    backgroundKey: "bg",
    spawn: { x: 100, y: 100 },
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
      { x: 400, y: 200, range: 700, speed: 100, name: "E1" },
      { x: 600, y: 350, range: 700, speed: 100, name: "E2" },
      { x: 680, y: 50, range: 1000, speed: 100, name: "E3" },
    ],
  },
};
