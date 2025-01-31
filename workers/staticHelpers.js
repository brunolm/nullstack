function withAPI(url) {
  let [path, query] = url.split('?');
  if (path.includes('.')) return url;
  path += '/index.json';
  return query ? [url, `${path}?${query}`] : [url, path];
}

async function extractData(response) {
  const html = await response.clone().text();
  const stateLookup = '<meta name="nullstack" content="';
  const state = html.split("\n").find((line) => line.indexOf(stateLookup) > -1).split(stateLookup)[1].slice(0, -2);
  const { instances, page } = JSON.parse(decodeURIComponent(state));
  const json = JSON.stringify({ instances, page });
  return new Response(json, {
    headers: { 'Content-Type': 'application/json' }
  });
}