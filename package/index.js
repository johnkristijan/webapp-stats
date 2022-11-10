const save = (v) => {
  localStorage.setItem("webapp-stat-buffer", JSON.stringify(v));
};

const load = () => {
  return JSON.parse(localStorage.getItem("webapp-stat-buffer"));
};

const ifUndefinedPopulateWithEmptyList = () => {
  if (!localStorage.getItem("webapp-stat-buffer")) {
    save([]);
  }
};

const clearLocalStorage = () => {
  localStorage.setItem("webapp-stat-buffer", "[]");
};

const sendStats = (statList, urlPrefix) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const body = JSON.stringify(statList);
  const method = "POST";
  const requestOptions = { method, headers, body };
  const url = urlPrefix + "/webapp-stats-backend?type=webapp-stats";
  fetch(url, requestOptions);
};

const webappStatTrack = async (to, from, appId, urlPrefix, senderDebounceLimit = 10, username = "anonymous") => {
  try {
    ifUndefinedPopulateWithEmptyList();
    const baseUrl = window.location.origin;
    const currentList = load();
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    currentList.push({
      app_id: appId,
      timestamp,
      user: username,
      from_path: baseUrl + from.path,
      to_path: baseUrl + to.path,
      screen_width: window.innerWidth || "",
      screen_height: window.innerHeight || "",
    });
    save(currentList);

    const listLength = currentList.length;

    if (listLength >= senderDebounceLimit) {
      sendStats(currentList, urlPrefix);
      clearLocalStorage();
    }
  } catch (e) {
    console.warn(e.message);
    // silently continue if it fails
  }
};

module.exports = webappStatTrack
