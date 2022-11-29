import styles from "./TextArea.module.css";
interface Properties {
  name: string;
  size: [string, string];
  title: string;
  placeholder: string;
  word_count_max: number;
}

export const TextArea = ({
  name,
  size = ["27rem", "27rem"],
  title,
  placeholder,
  word_count_max,
}: Properties) => {
  return (
    <>
      <h1 className={styles.Header}>PIQ Question:</h1>
      <input id="question" style={{ width: size[0] }} />
      <h1>{title}</h1>
      <h1 id="is_revised" style={{ display: "none" }}>
        Revised
      </h1>
      <textarea
        id={`textarea_output`}
        style={{ width: size[0], height: size[1] }}
        title={`textarea_${name}`}
        placeholder={placeholder}
        onKeyUp={update_count(word_count_max)}
      />
      <p id="character_count">Word count = 0/ {word_count_max}</p>
    </>
  );
};

const update_count = (max_word: number) => () => {
  const WordCounter = document.getElementById("character_count");
  const TextArea = document.getElementById(
    "textarea_output"
  ) as HTMLTextAreaElement;
  const count =
    TextArea && TextArea?.value ? Number(TextArea.value.split(" ").length) : 0;

  const count_ratio = count / max_word;
  if (WordCounter && WordCounter?.textContent) {
    WordCounter.textContent = `Word count = ${count}/${max_word}`;

    if (count_ratio > 1) {
      console.log(count_ratio);
      TextArea.value = TextArea.value
        .split(" ")
        .slice(0, 99)
        .reduce((accumalate, current) => accumalate + " " + current);
    }
  }
};
