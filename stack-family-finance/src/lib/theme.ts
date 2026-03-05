export function getTheme(): "light" | "dark" {
  return (localStorage.getItem("stack_theme") as "light" | "dark") || "light";
}

export function setTheme(theme: "light" | "dark") {
  localStorage.setItem("stack_theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function initTheme() {
  const theme = getTheme();
  document.documentElement.classList.toggle("dark", theme === "dark");
}
