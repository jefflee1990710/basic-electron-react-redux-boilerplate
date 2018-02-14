console.log(require('../assets/demo_photo.js').default);

const initState = {
  photoList : [],
  editMode : false,
  photoIndex: 0,
  isOpen: false,
  photoListLoading : false
}

export default function photolistReducr(state = initState, action) {
  switch(action.type){
    case 'select_folder_loading':
      state.photoListLoading = true;
      return {...state};
    case 'select_folder_done':
      state.photoList = require('../assets/demo_photo.js').default;
      state.photoListLoading = false;
      return {...state};
    case 'block_on_click':
      state.photoList[action.index].selected = !state.photoList[action.index].selected;
      state.photoList = state.photoList.slice();
      return {...state};
    case 'block_on_click_view_btn':
      state.photoIndex = action.index;
      state.isOpen = true;
      return {...state};
    case 'block_uncheck_all':
      for(let i = 0; i < state.photoList.length; i ++){
        state.photoList[i].selected = false;
      }
      state.photoList = state.photoList.slice();
      return {...state};
    case 'block_check_all':
      for(let i = 0; i < state.photoList.length; i ++){
        state.photoList[i].selected = true;
      }
      state.photoList = state.photoList.slice();
      return {...state};
    case 'block_toggle_edit_mode':
      state.editMode = !state.editMode;
      for(let i = 0; i < state.photoList.length; i ++){
        state.photoList[i].selected = false;
      }
      state.photoList = state.photoList.slice();
      return {...state};
    case 'goto_lightbox_index':
      state.photoIndex = action.index;
      return {...state};
    case 'close_lightbox':
      state.isOpen = false;
      return {...state};
    default:
      return state;
  }
}
