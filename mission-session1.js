"use strict";
(function () {
  const root = document.getElementById("beeMission");
  if (!root) return;
  const find = id => document.getElementById(id);
  const introPhoto = root.querySelector(".bee-field-photo img");
  if (introPhoto) {
    const markMissing = () => introPhoto.closest(".bee-field-photo").classList.add("is-missing");
    introPhoto.addEventListener("error", markMissing);
    if (introPhoto.complete && introPhoto.naturalWidth === 0) markMissing();
  }
  const stages = [
  {
    "title": "A confirmed finding",
    "evidence": "Site B · Lower reach: a researcher caught and identified one bull trout. All three independent water samples also tested positive for bull trout eDNA.",
    "question": "Which statement belongs in the field report?",
    "options": [
      {
        "id": "A",
        "text": "Bull trout may be present at Site B, but direct evidence is still needed.",
        "points": 1,
        "reason": "Too cautious: the captured and identified fish is direct evidence of presence at that location and time."
      },
      {
        "id": "B",
        "text": "Bull trout presence at Site B was confirmed during the survey, but population size is unknown.",
        "points": 2,
        "reason": "Correctly separates direct evidence of one fish from claims about population size or breeding."
      },
      {
        "id": "C",
        "text": "Both methods demonstrate that Site B supports a stable breeding population.",
        "points": 0,
        "reason": "A capture and positive eDNA results cannot establish breeding, population size or long-term stability."
      }
    ],
    "speaking": "What is the difference between confirming one fish and estimating a population?"
  },
  {
    "title": "The positive sample without a catch",
    "evidence": "Site A · Upper reach: two of three water samples tested positive, but no bull trout was caught in one electrofishing survey. Water can transport DNA downstream, and a direct survey can miss fish.",
    "question": "You have one more field visit. Which plan would reduce uncertainty most effectively?",
    "options": [
      {
        "id": "A",
        "text": "Classify Site A as definitely occupied because two water samples were positive.",
        "points": 0,
        "reason": "Positive eDNA supports possible presence in the contributing area; it does not locate individual fish precisely."
      },
      {
        "id": "B",
        "text": "Repeat electrofishing at exactly the same pool, but do not collect more water samples.",
        "points": 1,
        "reason": "A repeated direct survey may help, but it does less to investigate where the eDNA originated."
      },
      {
        "id": "C",
        "text": "Sample water both farther upstream and near Site A, and repeat a targeted direct survey.",
        "points": 2,
        "reason": "Combining spatial eDNA samples and another direct survey helps investigate the source of DNA and the possibility of non-detection."
      }
    ],
    "speaking": "Which limitation does your proposed sampling plan address?"
  },
  {
    "title": "The negative tributary",
    "evidence": "Site C · Tributary: none of the three water samples contained detectable bull trout eDNA, and no bull trout was caught. Both methods were used only once, after a period of high stream flow.",
    "question": "What is a defensible interpretation of Site C?",
    "options": [
      {
        "id": "A",
        "text": "Neither method detected bull trout on this visit; the data do not establish their absence.",
        "points": 2,
        "reason": "Non-detection on one visit is not proof of absence. Sampling effort and stream conditions affect detection."
      },
      {
        "id": "B",
        "text": "Bull trout are certainly absent because both methods gave negative results.",
        "points": 0,
        "reason": "Both methods can fail to detect fish, particularly with limited sampling and variable environmental conditions."
      },
      {
        "id": "C",
        "text": "Bull trout are probably absent, so Site C does not need any follow-up survey.",
        "points": 1,
        "reason": "Absence is possible, but these limited observations are not strong enough to dismiss further sampling."
      }
    ],
    "speaking": "What additional evidence would make your conclusion stronger?"
  },
  {
    "title": "Your message to conservation staff",
    "evidence": "The survey is complete. Site B had a confirmed capture; Site A produced positive eDNA without a capture; Site C produced no detections. Staff need a short conclusion that distinguishes observations from interpretations.",
    "question": "Which scientific summary should your team submit?",
    "options": [
      {
        "id": "A",
        "text": "Only the captured fish at B provides useful information; the findings at A and C should be discarded.",
        "points": 1,
        "reason": "The confirmed capture matters, but the other sites provide useful evidence about survey coverage and unresolved uncertainty."
      },
      {
        "id": "B",
        "text": "Presence was confirmed at B. eDNA at A suggests bull trout DNA within the upstream contributing area, but cannot pinpoint fish. No fish were detected at C; further surveys are warranted.",
        "points": 2,
        "reason": "This statement reports the direct observation, qualifies the eDNA result, and does not turn non-detection into proof of absence."
      },
      {
        "id": "C",
        "text": "The species occupies both A and B, and the negative findings demonstrate that C has no bull trout.",
        "points": 0,
        "reason": "It overstates what eDNA can locate and treats a limited set of negative surveys as conclusive."
      }
    ],
    "speaking": "Which phrase in your conclusion shows appropriate scientific caution?"
  }
];
  // Documentary photographs only; these do not depict the simulated survey.
  const stageMedia = [
    {src:"https://upload.wikimedia.org/wikipedia/commons/0/06/Bull_Trout_%2821300250425%29.jpg",
     alt:"A photographed bull trout resting in shallow clear water over stones",
     caption:"BULL TROUT / SPECIES IDENTIFICATION",credit:"Photo: Jim Mogen / USFWS · CC BY 2.0"},
    {src:"https://www.fws.gov/rivers/sites/default/files/2021-06/eDNA.jpg",
     alt:"Field researchers preparing tubes and equipment for water eDNA sampling",
     caption:"eDNA SAMPLING / DETECTION",credit:"Photo: Kyle Von Ruden / USFWS · Public domain"},
    {src:"https://www.fws.gov/sites/default/files/images/2025-08/barge_electrofishing_7.png",
     alt:"Fisheries researchers using electrofishing gear and nets in a shallow river",
     caption:"DIRECT FIELD SURVEY / ELECTROFISHING",credit:"Photo: USFWS · Public domain"},
    {src:"https://upload.wikimedia.org/wikipedia/commons/c/c1/Forested_stream_with_clear_water.png",
     alt:"A clear shallow river flowing between green forested banks",
     caption:"RIVER HABITAT / CONSERVATION REPORT",credit:"Photo: Ricecat1235 · CC0"}
  ];
  const maxScore = stages.length * 2;
  let selectedSize = 0;
  let active = false;
  let roundIndex = 0;
  let selections = [];
  let times = [];
  let activeSpeaker = -1;
  let speakerStartedAt = 0;
  let timerHandle = null;

  const show = (id, visible) => { find(id).hidden = !visible; };
  const formatTime = millis => {
    const secs = Math.floor(Math.max(0, millis) / 1000);
    return String(Math.floor(secs / 60)).padStart(2, "0") + ":" + String(secs % 60).padStart(2, "0");
  };
  const currentTime = i => (times[i] || 0) + (activeSpeaker === i ? Math.max(0, Date.now() - speakerStartedAt) : 0);
  const pauseSpeaker = () => {
    if (activeSpeaker !== -1) {
      times[activeSpeaker] += Math.max(0, Date.now() - speakerStartedAt);
      activeSpeaker = -1;
    }
    renderTimers();
  };
  const renderTimers = () => {
    if (!active) return;
    root.querySelectorAll("[data-speaker]").forEach(button => {
      const i = Number(button.dataset.speaker);
      const running = i === activeSpeaker;
      button.textContent = (running ? "Pause" : "Start") + " Player " + (i + 1);
      button.setAttribute("aria-pressed", String(running));
      find("beeTime" + i).textContent = formatTime(currentTime(i));
    });
  };
  const selectSize = size => {
    if (active || ![2, 3, 4].includes(size)) return;
    selectedSize = size;
    root.querySelectorAll("[data-mission-size]").forEach(button => {
      const selected = Number(button.dataset.missionSize) === size;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("is-selected", selected);
    });
    find("beeStart").disabled = false;
  };
  root.querySelectorAll("[data-mission-size]").forEach(button => {
    button.addEventListener("click", () => selectSize(Number(button.dataset.missionSize)));
  });
  const makeTimers = () => {
    const area = find("beeSpeakerButtons");
    area.replaceChildren();
    times = Array(selectedSize).fill(0);
    activeSpeaker = -1;
    for (let i = 0; i < selectedSize; i++) {
      const item = document.createElement("div");
      item.className = "bee-speaker";
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.speaker = String(i);
      button.className = "outline";
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        if (!active) return;
        const wasActive = activeSpeaker === i;
        pauseSpeaker();
        if (!wasActive) {
          activeSpeaker = i;
          speakerStartedAt = Date.now();
        }
        renderTimers();
      });
      const time = document.createElement("strong");
      time.id = "beeTime" + i;
      time.className = "bee-time";
      time.textContent = "00:00";
      item.append(button, time);
      area.append(item);
    }
    renderTimers();
  };
  const renderProgress = () => {
    find("beeStageCount").textContent = "Decision " + (roundIndex + 1) + " of " + stages.length;
    find("beeScore").textContent = "Team score: " + selections.reduce((total, choice) => total + choice.points, 0) + " / " + maxScore;
    find("beeProgressBar").style.width = (100 * roundIndex / stages.length) + "%";
  };
  const textNode = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text;
    return node;
  };
  const renderRound = () => {
    const step = stages[roundIndex];
    const media = stageMedia[roundIndex];
    const content = find("beeStageBody");
    const label = textNode("div","bee-case-top","CASE FILE / " + String(roundIndex + 1).padStart(2,"0"));
    const heading = textNode("h3","bee-stage-title",step.title);
    const figure = document.createElement("figure");
    figure.className = "bee-stage-visual";
    const photo = document.createElement("img");
    photo.src = media.src;
    photo.alt = media.alt;
    photo.loading = "eager";
    photo.addEventListener("error", () => {
      figure.classList.add("bee-stage-image-missing");
      photo.remove();
    });
    const credit = document.createElement("figcaption");
    credit.append(
      document.createTextNode(media.caption),
      textNode("small","",media.credit + " · Illustrative photograph")
    );
    figure.append(photo,credit);
    const evidence = document.createElement("div");
    evidence.className = "bee-evidence-card";
    evidence.append(
      textNode("span","bee-overline","RESEARCH EVIDENCE"),
      textNode("p","bee-evidence",step.evidence)
    );
    content.replaceChildren(label,heading,figure,evidence,textNode("p","bee-prompt",step.question));
    const options = find("beeDecisions");
    options.replaceChildren();
    step.options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bee-option";
      button.dataset.choice = option.id;
      const letter = textNode("span", "bee-option-letter", option.id);
      const body = textNode("span", "", option.text);
      button.append(letter, body);
      button.addEventListener("click", () => choose(option.id));
      options.append(button);
    });
    find("beeSpeakingPrompt").textContent = step.speaking;
    show("beeFeedback", false);
    show("beeNext", false);
    find("beeNext").textContent = roundIndex === stages.length - 1 ? "View team report" : "Next evidence →";
    renderProgress();
  };
  const choose = id => {
    if (!active || selections.length !== roundIndex) return;
    const selected = stages[roundIndex].options.find(x => x.id === id);
    if (!selected) return;
    pauseSpeaker();
    selections.push({ id: selected.id, points: selected.points });
    const total = selections.reduce((sum, choice) => sum + choice.points, 0);
    root.querySelectorAll(".bee-option").forEach(button => {
      button.disabled = true;
      if (button.dataset.choice === id) button.classList.add("is-chosen");
    });
    find("beeFeedbackVerdict").textContent = selected.points === 2 ? "Strong scientific decision · +2 points" : selected.points === 1 ? "Partly justified · +1 point" : "Not supported by the evidence · 0 points";
    find("beeFeedbackText").textContent = selected.reason;
    show("beeFeedback", true);
    show("beeNext", true);
    find("beeScore").textContent = "Team score: " + total + " / " + maxScore;
  };
  const finish = () => {
    pauseSpeaker();
    active = false;
    if (timerHandle !== null) { clearInterval(timerHandle); timerHandle = null; }
    show("beePlay", false);
    show("beeComplete", true);
    const total = selections.reduce((sum, choice) => sum + choice.points, 0);
    find("beeFinalScore").textContent = total + " / " + maxScore;
    const recap = find("beeRecap");
    recap.replaceChildren();
    selections.forEach((choice, i) => {
      const result = stages[i].options.find(option => option.id === choice.id);
      const row = document.createElement("li");
      row.append(
        textNode("strong", "", "Decision " + (i + 1) + " · " + choice.id + " · " + choice.points + "/2"),
        textNode("p", "", result.reason)
      );
      recap.append(row);
    });
    const timesList = find("beeFinalTimes");
    timesList.replaceChildren();
    times.forEach((time, i) => timesList.append(textNode("li", "", "Player " + (i + 1) + ": " + formatTime(time))));
    find("beeTakeaway").textContent = total >= 7
      ? "Your team consistently distinguished observations from inference."
      : total >= 4
        ? "Good start. Revisit the decisions where an inference was treated as a fact, or a confirmed result was weakened."
        : "Revisit the difference between capture, DNA detection and non-detection before drawing conclusions.";
    find("beeComplete").scrollIntoView({ block: "start", behavior: "auto" });
    find("beeCompleteTitle").focus({ preventScroll: true });
  };
  const start = () => {
    if (active || ![2, 3, 4].includes(selectedSize)) return;
    active = true;
    roundIndex = 0;
    selections = [];
    show("beeIntro", false);
    show("beeComplete", false);
    show("beePlay", true);
    makeTimers();
    renderRound();
    timerHandle = setInterval(renderTimers, 500);
    find("beePlay").scrollIntoView({ block: "start", behavior: "auto" });
    find("beeStageCount").focus({ preventScroll: true });
  };
  const next = () => {
    if (!active || selections.length !== roundIndex + 1) return;
    if (roundIndex === stages.length - 1) return finish();
    roundIndex++;
    renderRound();
    find("beePlay").scrollIntoView({ block: "start", behavior: "auto" });
    find("beeStageCount").focus({ preventScroll: true });
  };
  const reset = () => {
    if (active) pauseSpeaker();
    active = false;
    if (timerHandle !== null) { clearInterval(timerHandle); timerHandle = null; }
    selectedSize = 0;
    roundIndex = 0;
    selections = [];
    times = [];
    activeSpeaker = -1;
    root.querySelectorAll("[data-mission-size]").forEach(button => {
      button.setAttribute("aria-pressed", "false");
      button.classList.remove("is-selected");
    });
    find("beeStart").disabled = true;
    show("beeIntro", true);
    show("beePlay", false);
    show("beeComplete", false);
    find("beeIntro").scrollIntoView({ block: "start", behavior: "auto" });
  };
  find("beeStart").addEventListener("click", start);
  find("beeNext").addEventListener("click", next);
  find("beeRestart").addEventListener("click", reset);
  document.addEventListener("visibilitychange", () => { if (document.hidden && active) pauseSpeaker(); });
})();
