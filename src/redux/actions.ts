// src/redux/actions.ts

export const ActionTypes = {
    SET_DATA: 'SET_DATA',
    CLEAR_DATA: 'CLEAR_DATA',
};

export const setData = (payload: any) => ({
    type: ActionTypes.SET_DATA,
    payload,
});

export const clearData = () => ({
    type: ActionTypes.CLEAR_DATA,
});
export const setLoading = (isLoading: boolean) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});
export const setRedirectPath = (path: string) => ({
    type: 'SET_REDIRECT_PATH',
    payload: path,
  });