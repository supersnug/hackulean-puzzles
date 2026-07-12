const params = new URLSearchParams(window.location.search);

if (params.get("signal") === "mp2_reset_puzzle_05") {
  try {
    const completionKey = "hackulean_puzzle_completion_map";
    const completionMap = JSON.parse(localStorage.getItem(completionKey) || "{}");
    const safeMap = completionMap && typeof completionMap === "object" && !Array.isArray(completionMap)
      ? completionMap
      : {};
    delete safeMap["05-fixcorruption"];
    localStorage.setItem(completionKey, JSON.stringify(safeMap));
    localStorage.setItem("hackulean_mp2_puzzle_05_unlocked", "1");
  } catch (_error) {
    // Continue back to the root if storage is unavailable.
  }
  window.location.replace("/");
} else if (params.get("signal") === "mp2_advance_to_puzzle_06") {
  try {
    const completionKey = "hackulean_puzzle_completion_map";
    const completionMap = JSON.parse(localStorage.getItem(completionKey) || "{}");
    const safeMap = completionMap && typeof completionMap === "object" && !Array.isArray(completionMap)
      ? completionMap
      : {};
    safeMap["05-fixcorruption"] = true;
    delete safeMap["06-manage-database"];
    localStorage.setItem(completionKey, JSON.stringify(safeMap));
    localStorage.setItem("hackulean_mp2_puzzle_06_unlocked", "1");
    localStorage.removeItem("hackulean_managedatabase_manager_open");
    localStorage.removeItem("hackulean_managedatabase_active_event");
  } catch (_error) {
    // Continue back to the root if storage is unavailable.
  }
  window.location.replace("/");
}
