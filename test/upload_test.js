const UploadService = require('../libs/UploadService');
const uuidv4 = require('uuid/v4');

let jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMGE0YjAxYjk4ZmVjODk2NTAzZGU2ZGE4OTUwZjI4ZiIsImlhdCI6MTUxODU0NDkzNH0.gPI61BgE-wXDjh1udNVcSglWXN03CALb9AWbPINigtI';

const callback = (eventType, payload) => {
  console.log(eventType, payload);
}

(async () => {
  await UploadService.uploadFile(uuidv4(), jwtToken,
    '/Users/jefflee/Desktop/TestingDNG/DSC_9339.NEF', callback);
  await UploadService.uploadFile(uuidv4(), jwtToken,
    '/Users/jefflee/Desktop/TestingDNG/DSC_9340.NEF', callback);
  await UploadService.uploadFile(uuidv4(), jwtToken,
    '/Users/jefflee/Desktop/TestingDNG/DSC_9341.NEF', callback);
  await UploadService.uploadFile(uuidv4(), jwtToken,
    '/Users/jefflee/Desktop/TestingDNG/DSC_9342.NEF', callback);
  await UploadService.uploadFile(uuidv4(), jwtToken,
    '/Users/jefflee/Desktop/TestingDNG/DSC_9343.NEF', callback);
  await UploadService.uploadFile(uuidv4(), jwtToken,
    '/Users/jefflee/Desktop/TestingDNG/DSC_9344.NEF', callback);
  await UploadService.uploadFile(uuidv4(), jwtToken,
    '/Users/jefflee/Desktop/TestingDNG/DSC_9345.NEF', callback);
  await UploadService.uploadFile(uuidv4(), jwtToken,
    '/Users/jefflee/Desktop/TestingDNG/DSC_9346.NEF', callback);
  await UploadService.uploadFile(uuidv4(), jwtToken,
    '/Users/jefflee/Desktop/TestingDNG/DSC_9347.NEF', callback);
  await UploadService.uploadFile(uuidv4(), jwtToken,
    '/Users/jefflee/Desktop/TestingDNG/DSC_9348.NEF', callback);
})().then(() => {
  console.log('Upload success!');
}).catch((err) => {
  console.log(err);
})
