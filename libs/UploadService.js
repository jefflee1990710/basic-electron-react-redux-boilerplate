const fs = require('fs');
const mime = require('mime');
const dcraw = require('dcraw');
const os = require('os');
const path = require('path');
const uuidv4 = require('uuid/v4');
const fileExtension = require('file-extension');
const exifParser = require('exif-parser');
const request = require('request');
const {Transform} = require('stream');
const Setting = require('./Setting');

module.exports = {
  uploadFile : async function(uploadId, jwtToken, path, eventCallback){
    let localName = getLocalname(path);
    let buf = fs.readFileSync(path);
    let mime = getMimeType(path);
    let metadata = {
      jwtToken,
      ...mime,
      uploadId,
      localName
    }
    console.log('Upload object metadata : ', metadata);
    eventCallback('preparing_upload', {uploadId});
    let presignUrl = await getPresignUrl(metadata);
    console.log('Presign url : ', presignUrl);
    console.log('Uploading file...');
    await uploadFile(path, presignUrl, metadata, (percentage) => {
      eventCallback('uploading', {uploadId, percentage});
    });
    eventCallback('upload_done', {uploadId});
  }
}

const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    try{
      setTimeout(() => {
        resolve()
      }, ms);
    }catch(err){
      reject(err);
    }
  });
}

class ProgressStream extends Transform{
  constructor(total, percentageCallback){
    super();
    this.total = total;
    this.progress = 0;
    this.percentage = 0;
    this.percentageCallback = percentageCallback;
  }

  _transform(chunk, encoding, callback){
    this.progress += chunk.length
    this.percentage = this.progress/this.total;
    if(this.percentageCallback) this.percentageCallback(this.percentage)
    callback(null, chunk);
  }

}

const uploadFile = function(path, presignUrl, metadata, percentageCallback){
  return new Promise((resolve, reject) => {
    var stats = fs.statSync(path);
    let ps = new ProgressStream(stats['size'], percentageCallback);
    fs.createReadStream(path).pipe(ps).pipe(request({
        method: 'PUT',
        url: presignUrl,
        headers: {
          'Content-Length': stats['size'],
          'Content-Type' : metadata.mimeType
        }
      }, function (err, res, body) {
        if(err){
          console.log(err);
          reject(err);
        }else{
          resolve(res);
        }
      }));
  });
}

const getPresignUrl = function(metadata){
  var options = {
        method: 'POST',
        uri: Setting.API_UPLOAD_PRESIGN,
        body: {
          mimeType: metadata.mimeType,
          ext : metadata.ext,
          jwtToken : metadata.jwtToken,
          metadata : metadata
        },
        json: true // Automatically stringifies the body to JSON
    };
    return new Promise((resolve, reject) => {
      request(options, (err, data) => {
        if(err){
          console.log(err);
          reject(new UploadError());
        } else {
          console.log(data.body.presignUrl);
          resolve(data.body.presignUrl);
        }
      });
    });
}

const getMimeType = function(path){
  let ext = fileExtension(path);
  let mimeType = mime.getType(path);
  if(!mimeType){
    mimeType = rawMime(ext);
  }
  return {
    ext, mimeType
  }
}

const getLocalname = (localPath) => {
  return path.basename(localPath);
}

const rawMime = function(ext) {
  if(!ext){
    return 'application/octet-stream';
  }
  let rawMimemap = {
    ARW : 'image/x-sony-arw',
    CR2 : 'image/x-canon-cr2',
    CRW : 'image/x-canon-crw',
    DCR : 'image/x-kodak-dcr',
    DNG : 'image/x-adobe-dng',
    ERF : 'image/x-epson-erf',
    K25 : 'image/x-kodak-k25',
    KDC : 'image/x-kodak-kdc',
    MRW : 'image/x-minolta-mrw',
    NEF : 'image/x-nikon-nef',
    ORF : 'image/x-olympus-orf',
    PEF : 'image/x-pentax-pef',
    RAF : 'image/x-fuji-raf',
    RAW : 'image/x-panasonic-raw',
    SR2 : 'image/x-sony-sr2',
    SRF : 'image/x-sony-srf',
    X3F : 'image/x-sigma-x3f'
  }
  if(!rawMimemap[ext.toUpperCase()]){
    return 'application/octet-stream';
  }else{
    return rawMimemap[ext.toUpperCase()];
  }
}
