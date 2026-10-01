@import "tailwindcss";

:root {
  color-scheme: dark;
  font-family: Inter, 'Segoe UI', sans-serif;
  background: #0b0f19;
  color: #f8fafc;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(16, 185, 129, 0.18), transparent 32%),
    radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.12), transparent 28%),
    #0b0f19;
  color: #f8fafc;
}

* {
  box-sizing: border-box;
}

button,
input,
select,
textarea {
  font: inherit;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.75);
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.45);
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}
