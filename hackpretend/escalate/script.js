if (localStorage.getItem("hackulean_server_unavailable") === "1") {
  window.location.replace("/hackpretend/error");
}


const SECRET = "xxxxareoxxxx";
const form = document.getElementById("escalate-form");
const input = document.getElementById("escalate-code");
const result = document.getElementById("result");

input.addEventListener("input", () => {
  input.value = input.value.replace(/\s+/g, "");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entered = input.value.trim().toLowerCase();

  if (entered === SECRET) {
    localStorage.setItem("hackpretend_elevated", "1");
    result.textContent = "PRIVILEGES ESCALATED. REDIRECTING...";
    result.className = "result ok";
    setTimeout(() => {
      window.location.href = "/hackpretend";
    }, 500);
  } else {
    result.textContent = "AUTHORIZATION FAILED";
    result.className = "result bad";
  }
});
