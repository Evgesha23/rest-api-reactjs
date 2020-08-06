import {SAVE_TASK_REQUEST, FETCH_TASK_REQUEST, UPDATE_TASK_REQUEST, DELETE_TASK_REQUEST, TASK_SUCCESS, TASK_FAILURE} from "./taskTypes";
import axios from 'axios';

export const saveTask = task => {
    return dispatch => {
        dispatch(saveTaskRequest());
        axios.post("http://localhost:8081/rest/tasks", task)
            .then(response => {
                dispatch(taskSuccess(response.data));
            })
            .catch(error => {
                dispatch(taskFailure(error));
            });
    };
};

const saveTaskRequest = () => {
    return {
        type: SAVE_TASK_REQUEST
    };
};

const fetchTaskRequest = () => {
    return {
        type: FETCH_TASK_REQUEST
    };
};

export const fetchTask = taskId => {
    return dispatch => {
        dispatch(fetchTaskRequest());
        axios.get("http://localhost:8081/rest/tasks/"+taskId)
            .then(response => {
                dispatch(taskSuccess(response.data));
            })
            .catch(error => {
                dispatch(taskFailure(error));
            });
    };
};

const updateTaskRequest = () => {
    return {
        type: UPDATE_TASK_REQUEST
    };
};

export const updateTask = task => {
    return dispatch => {
        dispatch(updateTaskRequest());
        axios.put("http://localhost:8081/rest/tasks", task)
            .then(response => {
                dispatch(taskSuccess(response.data));
            })
            .catch(error => {
                dispatch(taskFailure(error));
            });
    };
};

const deleteTaskRequest = () => {
    return {
        type: DELETE_TASK_REQUEST
    };
};

export const deleteTask = taskId => {
    return dispatch => {
        dispatch(deleteTaskRequest());
        axios.delete("http://localhost:8081/rest/tasks/"+taskId)
            .then(response => {
                dispatch(taskSuccess(response.data));
            })
            .catch(error => {
                dispatch(taskFailure(error));
            });
    };
};

const taskSuccess = task => {
    return {
        type: TASK_SUCCESS,
        payload: task
    };
};

const taskFailure = error => {
    return {
        type: TASK_FAILURE,
        payload: error
    };
};
