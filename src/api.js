const host = 'https://8xp9wugndh.execute-api.ap-southeast-1.amazonaws.com';
const stage = 'dev';

const api  = {
    userLogin : host + '/' + stage + '/user/login',
    userFolders : host + '/' + stage + '/user/listFolders'
}

export default api;