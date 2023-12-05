const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Resolve the promise with the location object
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        // Reject the promise with the error object
        reject(error);
      }
    );
  });
};

const getDataDevice = () => {
  //Conseguir la data del navegador
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  const deviceInfo = {
    brand: "",
    model: "",
    os: "",
  };

  if (/android/.test(userAgent)) {
    // Si es un dispositivo Android, se puede utilizar la propiedad `Build` del objeto `window` para obtener información sobre el dispositivo.
    deviceInfo.brand = window.navigator.appCodeName;
    deviceInfo.model = window.navigator.productSub;
    deviceInfo.os = "Android";
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    // Si es un dispositivo iOS, se puede utilizar la propiedad `platform` del objeto `navigator` para obtener información sobre el dispositivo.
    deviceInfo.brand = "Apple";
    deviceInfo.model = navigator.platform;
    deviceInfo.os = "iOS";
  } else if (/win/.test(platform)) {
    // Si es un dispositivo con Windows, se puede utilizar la propiedad `platform` del objeto `navigator` para obtener información sobre el sistema operativo.
    deviceInfo.brand = "Microsoft";
    deviceInfo.model = "PC";
    deviceInfo.os = platform;
  } else {
    // Si no se puede determinar el tipo de dispositivo, se establece la información como desconocida.
    deviceInfo.brand = "Unknown";
    deviceInfo.model = "Unknown";
    deviceInfo.os = "Unknown";
  }

  return deviceInfo;
};

export { getDataDevice, getCurrentLocation };
