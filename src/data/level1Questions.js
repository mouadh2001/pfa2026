export const level1Questions = {
  q1: {
    q: "What is the pattern of this tumor ?",
    a: [
      "Myxoid",
      "Spindle cell",
      "Round cell",
      "Pleomorphic",
      "Epithelioid",
    ],
    c: [1],
    feedbacks: [
      {
        text: "Oups! It is not a myxoid tumor. A myxoid tumor is caracterised by a gelatinous material produced by soft tissue cells. It resembles epithelial mucin, but is not as thick (looks like watered-down mucin – it is not as blue or stringy). This is a myxoid pattern : ",
        imgs: ["../assets/tumeurs/q1ra.jpg"],
      },
      {
        text: "True! It is a fusiform tumor.Fusiform (spindle) cells are elongated and have tapered (pointed) ends. Usually both the nucleus and cytoplasm are elongated, but the term still applies for cells with spindle-shaped cytoplasmic outline but rounded (or only slightly oval) nucleus.“Fusiform” is derived from the Latin “fusus” meaning “spindle” ",
        imgs: ["../assets/tumeurs/q1rb.jpg"],
      },
      {
        text: "Oups! It is not a round cell tumorA round cell tumor is caracterised by round cells with often uniform round nuclei and increased nuclear-cytoplasmic ratio",
        imgs: [],
      },
      {
        text: "Oups! It is not a pleomorphic tumor A Pleomorphic tumor cells is caracterised by marked variation in size and shape, often including very large and bizarre forms. ",
        imgs: [],
      },
      {
        text: "Oups! It is not an epithélioid tumor An epithélioid tumor is caracterised by cells resemble epithelial cells with a rounded or polygonal appearance and at least moderate amounts of cytoplasm qnd and well-defined cell borders. ",
        imgs: [],
      },
    ],
  },

  q2: {
    q: "What is the architectural pattern of this tumor ?",
    a: ["Plexiform", "Fascicular", "Storiform", "Lobulated", "Whorled"],
    c: [1],
    feedbacks: [
      {
        text: "Oups! It is not a plexiform pattern A plexiform pattern is characterised by an  interwoven network. It resembles plexus or a network or even a bag of worms",
        imgs: [
          "../assets/tumeurs/q2ra1.jpg",
          "../assets/tumeurs/q2ra2.jpg",
        ],
      },
      {
        text: "True! It is a fascicular pattern. A fascicular pattern is characterised byspindled cells arranged in long fascicles ",
        imgs: [],
      },
      {
        text: "Oups! It is not a storiform patternshort fascicles of spindle cells that intersect or intertwine at various angles thereby resembling the weaving of a doormat or starburst. ",
        imgs: ["../assets/tumeurs/q2rc.jpg", "../assets/tumeurs/q2rc2.jpg"],
      },
      {
        text: "Oups! It is not a lobulated patternA lobuled pattern is referring to an anatomic unit (as in breast lobule). A lobulated tumor is characterised by clusters or nodules with smooth (non-infiltrative) contour, often separated by fibrous bands or stroma conforming to or resembling normal anatomic structures. Sometimes used synonymously with nodular. ",
        imgs: ["../assets/tumeurs/q2rd.jpg"],
      },
      {
        text: "Oups! It is not a whorled patternA whorled pattern is characterised by a wirled arrangement of cells. ",
        imgs: ["../assets/tumeurs/q2re.jpg"],
      },
    ],
  },

  q3: {
    q: "Does this tumor present ?",
    a: [
      "Prominent inflammatory infiltrate",
      "Nuclear palisade",
      "Myxoid stroma",
      "Prominent or distinctive blood vessels",
      "Scant stroma",
    ],
    c: [4],
    feedbacks: [
      {
        text: "Oups! There is not a prominent inflammatory infiltrate in this tumor  ",
        imgs: [],
      },
      {
        text: "Oups! There is not a nuclear palissading in this tumornuclear palissading is characterised by nuclei lining up in parallel arrays; resembling a picket fence. Etymology: French palissade, a fence of stakes. ",
        imgs: [
          "../assets/tumeurs/q3rb1.jpg",
          "../assets/tumeurs/q3rb2.jpg",
        ],
      },
      {
        text: "Oups! There is not a Myxoïd stroma in this tumorA myxoid stroma is caracterised by a gelatinous material produced by soft tissue cells. It resembles epithelial mucin, but is not as thick (looks like watered-down mucin – it is not as blue or stringy). This is a myxoid stroma in a low grade fibromyxoid sarcoma.",
        imgs: ["../assets/tumeurs/q3rc.jpg"],
      },
      {
        text: "Oups! There is not a prominent or distinctive  blood vessels in this tumor  ",
        imgs: [],
      },
      { text: "True! The stroma is scant ", imgs: [] },
    ],
  },

  q4: {
    q: "Does this tumor present ?",
    a: [
      "Abrupt tumor necrosis",
      "Hyaline necrosis",
      "Individually necrotic cells",
      "Mitotic figures",
      "Nuclear atypia",
    ],
    c: [2, 3, 4],
    feedbacks: [
      { text: "No abrupt necrosis.", imgs: [] },
      { text: "Not hyaline type.", imgs: [] },
      { text: "Yes — single cell necrosis.", imgs: [] },
      { text: "Yes — mitoses present.", imgs: [] },
      { text: "Yes — atypia visible.", imgs: [] },
    ],
  },

  q5: {
    q: "What type of differentiation do you suggest ?",
    a: [
      "Smooth muscle differentiation",
      "Skeletal muscle (striated) differentiation",
      "Neural differentiation",
      "Vascular differentiation",
      "No obvious line of differentiation",
    ],
    c: [0],
    feedbacks: [
      { text: "Correct! Smooth muscle.", imgs: [] },
      { text: "No striations.", imgs: [] },
      { text: "No S100 pattern.", imgs: [] },
      { text: "No endothelial lining.", imgs: [] },
      { text: "Look again.", imgs: [] },
    ],
  },

  q6: {
    q: "Which immunohistochemical study (panel) would you propose?",
    a: ["pan-Cytokeratin", "Melan-A", "H-caldesmon", "Desmin", "Myogenin"],
    c: [2, 3],
    feedbacks: [
      { text: "CK is negative.", imgs: [] },
      { text: "Melan-A irrelevant.", imgs: [] },
      { text: "Correct! Smooth muscle marker.", imgs: [] },
      { text: "Correct! Muscle marker.", imgs: [] },
      { text: "Myogenin negative.", imgs: [] },
    ],
  },

  q7: {
    q: "The immunohistochemical study showed positivity for desmin and H-caldesmon. Melan-A and myogenin are negative. What diagnosis do you retain?",
    a: [
      "Fibrosarcoma",
      "Melanoma",
      "Leiomyoma",
      "Leiomyosarcoma",
      "Solitary fibrous tumor",
    ],
    c: [3],
    feedbacks: [
      { text: "Markers don’t match.", imgs: [] },
      { text: "Melan-A negative.", imgs: [] },
      { text: "Benign? No atypia says otherwise.", imgs: [] },
      {
        text: "Malignant smooth muscle tumor.",
        imgs: [],
      },
      { text: "Not SFT.", imgs: [] },
    ],
  },
};
