import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { TextArea } from "../components/TextArea/TextArea";
import { useState } from "react";
import { Revisions } from "../components/Revisions/Revision";
import { BuyMeCoffee } from "../components/BuyMeCoffee/BuyMeCoffee";
import ReactLoading from "react-loading";

export default function Home() {
  const [revisions, setRevisions] = useState([]);
  const RevisionsArray = revisions.map((element, i) => (
    <Revisions key={i + "_revision"} text={element} />
  ));
  return (
    <div className={styles.container}>
      <Head>
        <title>PIQ Feedback</title>
        <meta name="description" content="Shape your PIQ's for free!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <footer className={styles.footer}>
        <h1>PIQ Feedback</h1>
      </footer>
      <main className={styles.main}>
        <section style={{ display: "flex" }}>
          <div
            id="side-bar"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "15rem",
              border: "1px solid white",
              marginRight: "1rem",
              gap: "1rem",
              height: "40rem",
              overflowY: "scroll",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            <div>
              <h3>History</h3>
              {RevisionsArray}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextArea
              size={["27rem", "27rem"]}
              name="input"
              placeholder={"Put your text in here"}
              title={"Enter your PIQ:"}
              word_count_max={350}
            />
            <div id="loader" style={{ margin: "1rem", display: "none" }}>
              <ReactLoading
                type={"spinningBubbles"}
                color={"white"}
                height={"3rem"}
                width={"3rem"}
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button id="feedback_button" onClick={get_feedback}>
                Get feedback
              </button>
              <button
                id="revision_button"
                onClick={() => revise(setRevisions, revisions)}
                style={{ display: "none" }}
              >
                Revise
              </button>
            </div>
            <h1>Feedback</h1>
            <p id="feedback" style={{ width: "27rem" }}></p>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        Unfortunately this service costs me a bit of money. I would be happy if
        you can donate a few dollars so that I can keep it active for other
        students.
        <BuyMeCoffee />
      </footer>
    </div>
  );
}

async function get_feedback() {
  const revision_button = document.getElementById(
    "revision_button"
  ) as HTMLButtonElement;
  const feedback_button = document.getElementById(
    "feedback_button"
  ) as HTMLButtonElement;
  const loader = document.getElementById("loader");
  const piq_question_element = document.getElementById(
    "question"
  ) as HTMLInputElement;
  const writing_element = document.getElementById(
    `textarea_output`
  ) as HTMLTextAreaElement;
  const feedback = document.getElementById("feedback");
  if (!(piq_question_element && writing_element && feedback && loader)) return;

  const piq_question = piq_question_element.value;
  const writing = writing_element.value;
  if (writing === "") return;
  loader.style.display = "";
  if (revision_button) {
    revision_button.disabled = true;
  }
  if (feedback_button) {
    feedback_button.disabled = true;
  }
  const { data } = await fetch("api/feedback", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ piq: piq_question, writing: writing }),
  }).then((req) => req.json());
  if (revision_button) {
    revision_button.disabled = false;
  }
  if (feedback_button) {
    feedback_button.disabled = false;
  }
  if (revision_button && revision_button.style.display === "none")
    revision_button.style.display = "";

  loader.style.display = "none";
  feedback.textContent = data.replace("\n", "");
}

async function revise(setRevisions: Function, revisions: [string] | never[]) {
  const loader = document.getElementById("loader");
  const revision = document.getElementById("is_revised");
  const feedback = document.getElementById("feedback")?.textContent;
  const revision_button = document.getElementById(
    "revision_button"
  ) as HTMLButtonElement;
  const feedback_button = document.getElementById(
    "feedback_button"
  ) as HTMLButtonElement;
  const writing_element = document.getElementById(
    `textarea_output`
  ) as HTMLTextAreaElement;

  if (writing_element === undefined) return;
  const writing = writing_element.value;

  const newArray = [...revisions, writing];
  setRevisions(newArray);
  writing_element.style.display = "none";

  if (revision) revision.innerText = "Revising";
  if (loader) loader.style.display = "";
  if (revision_button) {
    revision_button.disabled = true;
  }
  if (feedback_button) {
    feedback_button.disabled = true;
  }
  const { data } = await fetch("api/revise", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedback: feedback, writing: writing }),
  }).then((req) => req.json());
  if (revision_button) {
    revision_button.disabled = false;
  }
  if (feedback_button) {
    feedback_button.disabled = false;
  }
  if (loader) loader.style.display = "none";
  if (writing_element && writing_element?.value)
    writing_element.value = data.replace("\n", "").replace("\n", "");
  writing_element.style.display = "";

  if (revision) {
    revision.innerText = "Revised";
    revision.style.display = "";
  }
}
