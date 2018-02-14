const initState = {
  calendarDate : new Date(),
  folderList : [
    {
      folderId : 'all',
      folderName : 'All Photos'
    },
    {
      folderId : 'f1',
      folderName : 'Folder 1'
    },
    {
      folderId : 'f2',
      folderName : 'Folder 2'
    },
    {
      folderId : 'f3',
      folderName : 'Folder 3'
    },
    {
      folderId : 'f4',
      folderName : 'Folder 4'
    }
  ],
  folderEditMode : false,
  folderListLoading : false
}

export default function folderReducr(state = initState, action) {
  switch(action.type){
    case 'calendar_on_change':
      state.calendarDate = action.date;
      return {...state};
    case 'toggle_folder_editmode':
      state.folderEditMode = !state.folderEditMode;
      return {...state};
    case 'select_folder_loading':
      state.folderList = state.folderList.map((obj) => {
        obj.selected = false;
        obj.disable = false;
        if(obj.folderId === action.folderId){
          obj.selected = true;
          obj.disable = true;
        }
        return obj;
      });
      return {...state};
    case 'load_folder_loading':
      state.folderListLoading = true;
      return {...state};
    case 'load_folder_fail':
      state.folderListLoading = false;
      return {...state};
    case 'load_folder_done':
      state.folderList = action.folders.slice();
      state.folderListLoading = false;
      return {...state};
    default:
      return state;
  }
}
