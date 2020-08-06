import React, {Component} from 'react';

import {connect} from 'react-redux';
import {deleteTask} from '../../services/index';

import './../../assets/css/Style.css';
import {Card, Table, Form, Row, Col, ButtonGroup, Button, InputGroup, FormControl} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faPlus, faTrash, faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import MyToast from '../MyToast';
import axios from 'axios';

class MainBaseList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            baseList : [],
            search : '',
            currentPage : 1,
            tasksPerPage : 9,
            sortDir: "asc"
        };
    }

    sortData = () => {
        setTimeout(() => {
            this.state.sortDir === "asc" ? this.setState({sortDir: "desc"}) : this.setState({sortDir: "asc"});
            this.findAllTasks(this.state.currentPage);
        }, 500);
    };

    componentDidMount() {
        this.findAllTasks(this.state.currentPage);
    }

    findAllTasks(currentPage) {
        currentPage -= 1;
        axios.get("http://localhost:8081/rest/tasks?pageNumber="+currentPage+"&pageSize="+this.state.tasksPerPage+"&sortBy=id&sortDir="+this.state.sortDir)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    baseList: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    };

    deleteTask = (taskId) => {
        this.props.deleteTask(taskId);
        setTimeout(() => {
            if(this.props.taskObject != null) {
                this.setState({"show":true});
                setTimeout(() => this.setState({"show":false}), 1000);
                this.findAllTasks(this.state.currentPage);
            } else {
                this.setState({"show":false});
            }
        }, 1000);
    };

    changePage = event => {
        let targetPage = parseInt(event.target.value);
        if(this.state.search) {
            this.searchData(targetPage);
        } else {
            this.findAllTasks(targetPage);
        }
        this.setState({
            [event.target.name]: targetPage
        });
    };

    firstPage = () => {
        let firstPage = 1;
        if(this.state.currentPage > firstPage) {
            if(this.state.search) {
                this.searchData(firstPage);
            } else {
                this.findAllTasks(firstPage);
            }
        }
    };

    prevPage = () => {
        let prevPage = 1;
        if(this.state.currentPage > prevPage) {
            if(this.state.search) {
                this.searchData(this.state.currentPage - prevPage);
            } else {
                this.findAllTasks(this.state.currentPage - prevPage);
            }
        }
    };

    lastPage = () => {
        let condition = Math.ceil(this.state.totalElements / this.state.tasksPerPage);
        if(this.state.currentPage < condition) {
            if(this.state.search) {
                this.searchData(condition);
            } else {
                this.findAllTasks(condition);
            }
        }
    };

    nextPage = () => {
        if(this.state.currentPage < Math.ceil(this.state.totalElements / this.state.tasksPerPage)) {
            if(this.state.search) {
                this.searchData(this.state.currentPage + 1);
            } else {
                this.findAllTasks(this.state.currentPage + 1);
            }
        }
    };

    searchChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };

    cancelSearch = () => {
        this.setState({"search" : ''});
        this.findAllTasks(this.state.currentPage);
    };

    searchData = (currentPage) => {
        currentPage -= 1;
        axios.get("http://localhost:8081/rest/tasks/search/"+this.state.search+"?page="+currentPage+"&size="+this.state.tasksPerPage)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    baseList: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    };

    render() {
        const customIcon = {
            border: "1.5px solid"
        }
        const pageNumCss = {
            maxWidth: "45px",
            border: "1px solid #17a2bb",
            color: "#17a2bb",
            textAlign: "center",
            backgroundColor: "#e9edf5"
        }
        const {baseList, currentPage, totalPages, search} = this.state;

        return (
            <div className={"mx-auto"} style={{marginTop: "80px", maxWidth: "1400px", tableLayout: "fixed"}}>
                <div style={{"display":this.state.show ? "block" : "none"}}>
                    <MyToast show = {this.state.show} message = {"Заявка успешно удалена."} type = {"danger"}/>
                </div>
                <div>
                    <Form.Group className="mx-auto" style={{maxWidth: "1200px"}} as={Row}>
                        <div className="mr-auto">
                            <Link to="/add-new-task">
                                <Button size="sm" variant="outline-success" style={customIcon}>
                                    <FontAwesomeIcon icon={faPlus}/>
                                </Button>
                            </Link>
                        </div>

                            {/* <div className="mr-3 mt-1">
                            <Button type="info" size="sm" style={{border: "1.5px solid #264A9C", borderRadius: "50%", backgroundColor: "#3562C9"}}>
                                <FontAwesomeIcon icon={faQuestion} color="white"/>
                            </Button>
                        </div>*/}
                        <div style={{"float":"right"}}>
                            <InputGroup size="sm">
                                <FormControl placeholder="Поиск" name="search" value={search}
                                             onChange={this.searchChange}/>
                                <InputGroup.Append>
                                    <Button size="sm" variant="outline-info" type="button" onClick={this.searchData}>
                                        <FontAwesomeIcon icon={faSearch}/>
                                    </Button>
                                    <Button size="sm" variant="outline-danger" type="button" onClick={this.cancelSearch}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </Form.Group>
                </div>
                <div className={"my-3"}>
                    <Card className={"mx-auto"} style={{maxWidth: "1400px", height: "548px"}}>
                        <table className="table table-bordered table-hover mx-auto mb-0" id="baseTest">
                            <thead className="text-center" style={{backgroundColor: "#2C4295", color: "whitesmoke"}}>
                            <tr>
                                <th>#</th>
                                <th onClick={this.sortData}>Название  <div className={this.state.sortDir === "asc" ? "arrow arrow-up" : "arrow arrow-down"}> </div></th>
                                <th onClick={this.sortData}>Ссылка  <div className={this.state.sortDir === "asc" ? "arrow arrow-up" : "arrow arrow-down"}> </div></th>
                                <th>Место</th>
                                <th>Создана</th>
                                <th>Создал</th>
                                <th>Ошибки</th>
                                <th>Часы</th>
                                <th>Сложность</th>
                                <th>Действие</th>
                            </tr>
                            </thead>
                            <tbody  className="text-center" style={{color: "#4db2ff", font: "12pt roboto"}}>
                            {
                                baseList.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="10">Заявки не найдены.</td>
                                    </tr> :
                                    baseList.map((task) => (
                                        <tr key={task.id}>
                                            <td></td>
                                            <td><div>{task.taskName}</div></td>
                                            <td><div>{task.taskLink}</div></td>
                                            <td>{task.place}</td>
                                            <th></th>
                                            <th></th>
                                            <td>{task.amountErrors}</td>
                                            <td>{task.hours}</td>
                                            <td>{task.mark}</td>
                                            <td>
                                                <ButtonGroup style={{maxWidth: "80px", height: "30px"}}>
                                                    <Link to={"edit-task/"+task.id} className="btn btn-sm btn-outline-warning"><FontAwesomeIcon icon={faEdit} /></Link>{' '}
                                                    <Button size="sm" variant="outline-danger" onClick={this.deleteTask.bind(this, task.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))
                            }
                            </tbody>
                        </table>
                    </Card>
                </div>

                <div className="col-xl-12">
                    <Row>
                        <Col style={{"float": "left"}}>
                            Страница {currentPage} из {totalPages}
                        </Col>
                        {baseList.length > 0 ?
                        <Col style={{"float":"center"}}>
                            <InputGroup size={"sm"}>
                                <InputGroup.Prepend>
                                    <Button type="button" variant={"outline-info"}
                                            disabled={currentPage === 1 ? true : false}
                                            onClick={this.firstPage}>{"<<"}</Button>
                                    <Button type="button" variant={"outline-info"}
                                            disabled={currentPage === 1 ? true : false}
                                            onClick={this.prevPage}>{"<"}</Button>
                                </InputGroup.Prepend>
                                <FormControl style={pageNumCss} name={"currentPage"} value={currentPage} onChange={this.changePage}/>
                                <InputGroup.Append>
                                    <Button type="button" variant={"outline-info"}
                                            disabled={currentPage === totalPages ? true : false}
                                            onClick={this.nextPage}>{">"}</Button>
                                    <Button type="button" variant={"outline-info"}
                                            disabled={currentPage === totalPages ? true : false}
                                            onClick={this.lastPage}>{">>"}</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                            : null }
                        <div>
                            <Button style={{marginRight: "50px"}}>Создать отчет</Button>
                        </div>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        taskObject: state.task
    };
};

const mapDispatchToProps = dispatch => {
    return {
        deleteTask: (taskId) => dispatch(deleteTask(taskId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainBaseList);




