import {SAVE_TASK_REQUEST, FETCH_TASK_REQUEST, UPDATE_TASK_REQUEST, DELETE_TASK_REQUEST, TASK_SUCCESS, TASK_FAILURE} from "./taskTypes";

const initialState = {
    task: '', error: ''
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case SAVE_TASK_REQUEST || FETCH_TASK_REQUEST || UPDATE_TASK_REQUEST || DELETE_TASK_REQUEST:
            return {
                ...state
            };
        case TASK_SUCCESS:
            return {
                task: action.payload,
                error: ''
            };
        case TASK_FAILURE:
            return {
                task: '',
                error: action.payload
            };
        default: return state;
    }
};

export default reducer;
