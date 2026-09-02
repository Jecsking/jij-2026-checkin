const SCRIPT = `
(function () {
  try {
    var stocke = localStorage.getItem("theme");
    var sombre = stocke ? stocke === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (sombre) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
