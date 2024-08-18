import React, { useState } from "react";
import NewQuiz from "./newQuiz";
import AssignQuiz from "./assignQuiz";

export default function Admin() {
  const [selected, setSelected] = useState("assignQuiz");

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              {selected === "assignQuiz" ? (
                <button className="nav-link disabled">Assign New Page</button>
              ) : (
                <button
                  className="naw-link"
                  onClick={() => {
                    setSelected("assignQuiz");
                  }}
                >
                  Assign New Page
                </button>
              )}
              {selected === "newQuiz" ? (
                <button className="nav-link disabled">Create New Quiz</button>
              ) : (
                <button
                  className="naw-link"
                  onClick={() => {
                    setSelected("newQuiz");
                  }}
                >
                  Create New Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      {selected === "assignQuiz" ? <AssignQuiz /> : <NewQuiz />}
    </>
  );
}
