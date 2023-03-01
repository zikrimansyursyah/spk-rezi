export async function httpCall(method, url, data = null, headers = null) {
  let config = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data !== null) {
    config.body = JSON.stringify(data);
  }

  if (headers !== null) {
    config.headers = { ...config.headers, ...headers };
  }

  let api = {
    status: 500,
    message: null,
  };

  await fetch(url, config)
    .then((response) => {
      api.status = response.status;
      return response.json();
    })
    .then((result) => {
      api = { ...api, ...result };
    })
    .catch((error) => {
      api.message = error?.message;
    });

  return api;
}
