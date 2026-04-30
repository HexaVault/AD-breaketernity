export function watchLatestCommit() {
  if (LOCAL) return;

  const url = "commit.json";
  let current;

  function watch() {
    fetch(url, { method: "GET" })
      .then(response => response.json())
      .then(json => {
        if (json === undefined) return;

        current = current ?? json.sha;
        if (current === json.sha) return;

        Modal.message.show(
          i18n("modal", "refresh", [json.message, json.author]),
          {
            callback: updateRefresh,
            closeButton: true
          },
          3
        );
      });
  }

  setInterval(watch, 60000);
}
