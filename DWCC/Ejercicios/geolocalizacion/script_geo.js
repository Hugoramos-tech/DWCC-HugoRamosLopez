navigator.geolocation.getCurrentPosition(
  (pos) => {
    console.log(pos.coords.latitude, pos.coords.longitude);
  },
  (err) => {
    console.error('Permiso denegado o error', err);
  }
);

