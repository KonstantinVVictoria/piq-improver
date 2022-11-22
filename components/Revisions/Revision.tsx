export function Revisions({ text }: { text: string }) {
  return (
    <div
      title={"Click to copy"}
      style={{
        width: "92%",
        height: "13rem",
        padding: "1rem",
        overflowY: "scroll",
        border: "1px solid white",
        borderRadius: "15px",
        cursor: "pointer",
      }}
      onClick={({ target }) => Copy(target)}
    >
      {text}
    </div>
  );
}
function Copy(target: EventTarget) {
  const Element = target as HTMLElement;
  navigator.clipboard.writeText(Element.innerText);
}
