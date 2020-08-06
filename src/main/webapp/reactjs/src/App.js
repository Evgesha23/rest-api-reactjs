import React from 'react';
import './App.css';

import {Row, Col} from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import StartPage from "./components/StartPage";
import Autorization from "./components/Autorization";
import SignUp from "./components/SignUp";
import MainBaseList from "./components/Book/MainBaseList";
import MainBaseAdd from "./components/Book/MainBaseAdd";
import Book from "./components/Book/Book";
import BookList from "./components/Book/BookList";


function App(props) {
  return (
    <Router>
        <div className="body" style={{height: "100vh", display: "flex", flexDirection: "column"}}>

            <NavigationBar loggedIn={props.loggedIn}/>

            <div className="content" style={{flex: "1 0 auto", marginBottom: "50px"}}>
            <Row>
                <Col lg={12} className={"margin-top"}>
                    <Switch>
                        <Route path="/" exact component={StartPage}/>
                        <Route path="/edit/:id" exact component={Book}/>
                        <Route path="/add" exact component={BookList}/>
                        <Route path="/edit-task/:id" exact component={MainBaseAdd}/>
                        <Route path="/add-new-task" exact component={MainBaseAdd}/>
                        <Route path="/base" exact component={MainBaseList}/>
                        <Route path="/register" exact component={() => <SignUp loggedIn={props.loggedIn}/>}/>
                        <Route path="/signIn" exact component={() => <Autorization loggedIn={props.loggedIn}/>}/>
                    </Switch>
                </Col>
            </Row>
            </div>

            <Footer/>

        </div>
    </Router>
  );
}

const putDispatchToProps = dispatch => bindActionCreators({}, dispatch);
const putStateToProps = (state) => {
    return {
        loggedIn: state.loggedIn,
    }
};
export default connect(putStateToProps, putDispatchToProps)(App);
