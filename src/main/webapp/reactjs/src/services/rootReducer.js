import {combineReducers} from 'redux';
import userReducer from './user/userReducer';
import bookReducer from './book/bookReducer';
import taskReducer from './task/taskReducer';

const rootReducer = combineReducers({
    user: userReducer,
    book: bookReducer,
    task: taskReducer
});

export default rootReducer;
