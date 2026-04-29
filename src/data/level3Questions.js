export const level3Questions = {
  q1: {
    q: "Level 3: Which histological feature is most prominent?",
    a: [
      "Uniform spindle cells",
      "Extensive necrosis",
      "High mitotic activity",
      "Clear cell change",
      "Lymphoid infiltrate",
    ],
    c: [2],
    feedbacks: [
      { text: "Not this one. Look for more mitoses.", imgs: [] },
      {
        text: "Necrosis is present but not the most striking feature.",
        imgs: [],
      },
      { text: "Correct! High mitotic activity is the key finding.", imgs: [] },
      { text: "Clear cell change is not the dominant pattern here.", imgs: [] },
      {
        text: "There is no strong lymphoid infiltrate in this case.",
        imgs: [],
      },
    ],
  },
  q2: {
    q: "Which immunostain panel is most appropriate for this tumor?",
    a: [
      "S100 and Melan-A",
      "Desmin and SMA",
      "Cytokeratin AE1/AE3",
      "CD34 and STAT6",
      "Chromogranin and Synaptophysin",
    ],
    c: [1],
    feedbacks: [
      { text: "This panel is more typical of melanoma.", imgs: [] },
      {
        text: "Correct! Smooth muscle markers are most useful here.",
        imgs: [],
      },
      {
        text: "Cytokeratin is not the best choice for this mesenchymal lesion.",
        imgs: [],
      },
      { text: "CD34/STAT6 is used for solitary fibrous tumors.", imgs: [] },
      {
        text: "Neuroendocrine markers are not appropriate for this case.",
        imgs: [],
      },
    ],
  },
  q3: {
    q: "What is the best description of the tumor architecture?",
    a: ["Fascicular", "Storiform", "Plexiform", "Nested", "Sheet-like"],
    c: [4],
    feedbacks: [
      {
        text: "Correct! The tumor shows a fascicular growth pattern.",
        imgs: [],
      },
      { text: "This case is not predominantly storiform.", imgs: [] },
      {
        text: "Plexiform pattern is not the dominant architecture here.",
        imgs: [],
      },
      { text: "Nested architecture is not seen.", imgs: [] },
      { text: "The tumor is not sheet-like in appearance.", imgs: [] },
    ],
  },
  q4: {
    q: "Which feature supports malignancy in this specimen?",
    a: [
      "Uniform cytology",
      "High nuclear-cytoplasmic ratio",
      "Well-defined capsule",
      "Low cellularity",
      "Minimal pleomorphism",
    ],
    c: [3],
    feedbacks: [
      { text: "Uniform cytology suggests a benign process.", imgs: [] },
      { text: "Correct! High N:C ratio is a malignancy feature.", imgs: [] },
      { text: "A capsule is more typical of a benign tumor.", imgs: [] },
      { text: "Low cellularity does not support malignancy.", imgs: [] },
      { text: "Minimal pleomorphism is not characteristic here.", imgs: [] },
    ],
  },
  q5: {
    q: "What is the most likely line of differentiation?",
    a: ["Neural", "Muscle", "Vascular", "Adipocytic", "Fibrohistiocytic"],
    c: [0],
    feedbacks: [
      {
        text: "Neural differentiation is not supported by the morphology.",
        imgs: [],
      },
      { text: "Correct! The tumor shows muscle differentiation.", imgs: [] },
      { text: "Vascular differentiation is not the best fit.", imgs: [] },
      { text: "Adipocytic features are absent.", imgs: [] },
      { text: "Fibrohistiocytic is not the dominant line here.", imgs: [] },
    ],
  },
  q6: {
    q: "Which marker combination confirms the diagnosis?",
    a: [
      "SMA + Desmin",
      "S100 + SOX10",
      "CD31 + ERG",
      "PanCK + EMA",
      "HMB45 + Melan-A",
    ],
    c: [1],
    feedbacks: [
      {
        text: "Correct! Smooth muscle markers confirm the diagnosis.",
        imgs: [],
      },
      { text: "These markers are for neural/melanocytic lesions.", imgs: [] },
      { text: "CD31/ERG are vascular markers.", imgs: [] },
      { text: "PanCK/EMA are epithelial markers.", imgs: [] },
      { text: "HMB45/Melan-A are melanocytic markers.", imgs: [] },
    ],
  },
  q7: {
    q: "Given the morphology and markers, what is the most likely diagnosis?",
    a: [
      "Leiomyosarcoma",
      "Gastrointestinal stromal tumor",
      "Dermatofibrosarcoma protuberans",
      "Malignant peripheral nerve sheath tumor",
      "Synovial sarcoma",
    ],
    c: [2],
    feedbacks: [
      {
        text: "Correct! The tumor is best classified as leiomyosarcoma.",
        imgs: [],
      },
      { text: "GIST would require KIT or DOG1 positivity.", imgs: [] },
      { text: "DFSP has CD34 positivity and storiform pattern.", imgs: [] },
      { text: "MPNST has S100/SOX10 positivity.", imgs: [] },
      { text: "Synovial sarcoma has different marker profile.", imgs: [] },
    ],
  },
};
