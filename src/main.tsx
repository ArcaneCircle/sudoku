import "@webxdc/highscores";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

window.highscores
  .init({
    onHighscoresChanged: () => {
      const scoreboard = document.getElementById("scoreboard");
      if (scoreboard) {
        scoreboard.innerHTML = window.highscores.renderScoreboard().innerHTML;
      }
    },
  })
  .then(() => {
    const container = document.getElementById("root");
    const root = createRoot(container!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });
