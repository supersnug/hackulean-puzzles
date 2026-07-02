const outageActive = localStorage.getItem("hackulean_server_unavailable") === "1";

if (outageActive) {
  document.body.classList.add("outage-mode");

  const title = document.getElementById("error-title");
  const line1 = document.getElementById("error-line-1");
  const line2 = document.getElementById("error-line-2");
  const code = document.getElementById("error-code");
  const link = document.getElementById("error-link");

  title.textContent = "SERVER NOT AVAILABLE";
  line1.textContent = "Critical relay saturation detected from oversized data transfer.";
  line2.textContent = "All linked endpoints are temporarily unavailable until reset.";
  code.textContent = "Error code: 9k7d61aq";
  link.textContent = "";
  link.href = "/hackpretend/error";
}
