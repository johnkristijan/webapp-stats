const save = (v) => {
  localStorage.setItem("webapp-stat-buffer", JSON.stringify(v));
};

const load = () => {
  const ls = localStorage.getItem("webapp-stat-buffer");
  const parsed = JSON.parse(ls);
  return parsed;
};

const ifUndefinedPopulateWithEmptyList = () => {
  const ls = localStorage.getItem("webapp-stat-buffer");
  if (!ls) {
    save([]);
  }
};

const clearLocalStorage = () => {
    localStorage.setItem('webapp-stat-buffer', '[]')
}

const sendStats = (statList) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const body = JSON.stringify(statList);
  const method = "POST";
  const requestOptions = { method, headers, body };
  fetch("http://localhost:3030/webapp-stats", requestOptions);
};

const webappStatTrack = async (to, from) => {
  try {
    ifUndefinedPopulateWithEmptyList();
    const username = undefined
    const baseUrl = 'http://localhost'
    const senderDebounceLimit = 5 // controls how often you send "save data api"
    const currentList = load();
    const timestamp = new Date().toISOString();
    currentList.push({
      app_id: "746425d2-1629-46ea-a487-13738d9a99b8", // use env variable or similar
      timestamp,
      user: username || 'anonymous',
      from_path: baseUrl + from.path,
      to_path: baseUrl + to.path,
      screen_width: window.innerWidth || "",
      screen_height: window.innerHeight || "",
    });
    save(currentList);

    const listLength = currentList.length;

    if (listLength > senderDebounceLimit) {
      sendStats(currentList);
      clearLocalStorage()
    }
  } catch (e) {
    console.warn(e.message);
    // silently continue if it fails
  }

  return true;
};

export default webappStatTrack;
