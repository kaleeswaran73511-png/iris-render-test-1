/* Web edition: the frontend and the API are served by the same Render
   service, so the backend URL is simply this site's own address. */
window.IRIS_CONFIG = {
  backendUrl: window.location.origin,
  wsUrl: ''
};
