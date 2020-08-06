import React, {Component} from 'react';

import {connect} from 'react-redux';
import {saveTask, fetchTask, updateTask} from '../../services/index';

import {Card, Form, Button, Col, Row} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSave, faUndo, faEdit, faPlusCircle, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import MyToast from '../MyToast';
import axios from 'axios';

class MainBaseAdd extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state = {
            places : [],
            show : false
        };
        this.taskChange = this.taskChange.bind(this);
        this.submitTask = this.submitTask.bind(this);
    }

    initialState = {
        id:'', taskName:'', taskLink:'', amountErrors:'', hours:'', mark:'', place:''
    };

    componentDidMount() {
        const taskId = +this.props.match.params.id;
        if(taskId) {
            this.findTaskById(taskId);
        }
        this.findAllPlaces();
    }

    findAllPlaces = () => {
        axios.get("http://localhost:8081/rest/tasks/places")
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    places: [{value:'', display:'Выберите место тестирования'}]
                        .concat(data.map(place => {
                            return {value:place, display:place}
                        }))
                });
            });
    };

    findTaskById = (taskId) => {
        this.props.fetchTask(taskId);
        setTimeout(() => {
            let task = this.props.taskObject.task;
            if(task != null) {
                this.setState({
                    id: task.id,
                    taskName: task.taskName,
                    taskLink: task.taskLink,
                    amountErrors: task.amountErrors,
                    hours: task.hours,
                    mark: task.mark,
                    place: task.place
                });
            }
        }, 1000);
    };

    resetTask = () => {
        this.setState(() => this.initialState);
    };

    submitTask = event => {
        event.preventDefault();

        const task = {
            taskName: this.state.taskName,
            taskLink: this.state.taskLink,
            amountErrors: this.state.amountErrors,
            hours: this.state.hours,
            mark: this.state.mark,
            place: this.state.place
        };

        this.props.saveTask(task);
        setTimeout(() => {
            if(this.props.savedTaskObject.task != null) {
                this.setState({"show":true, "method":"post"});
                setTimeout(() => this.setState({"show":false}), 1000);
            } else {
                this.setState({"show":false});
            }
        }, 500);

        this.setState(this.initialState);
    };

    updateTask = event => {
        event.preventDefault();

        const task = {
            id: this.state.id,
            taskName: this.state.taskName,
            taskLink: this.state.taskLink,
            amountErrors: this.state.amountErrors,
            hours: this.state.hours,
            mark: this.state.mark,
            place: this.state.place
        };
        this.props.updateTask(task);
        setTimeout(() => {
            if(this.props.updatedTaskObject.task != null) {
                this.setState({"show":true, "method":"put"});
                setTimeout(() => this.setState({"show":false}), 500);
            } else {
                this.setState({"show":false});
            }
        }, 500);

        this.setState(this.initialState);
    };

    taskChange = event => {
        this.setState({
            [event.target.name]:event.target.value
        });
    };

    taskList = () => {
        return this.props.history.push("/base");
    };

    render() {
        const {taskName, taskLink, amountErrors, hours, mark, place} = this.state;

        return (
            <div>
                <div style={{"display":this.state.show ? "block" : "none"}}>
                    <MyToast show = {this.state.show} message = {this.state.method === "put" ? "Данные обновлены" : "Заявка успешно добавлена."} type = {"success"}/>
                </div>
                <div style={{ marginTop: "70pt", maxWidth: "700px"}} className="overflow-hidden mx-auto">
                    <Card className={"text-black shadow"} style={{backgroundColor: "#f8f8ff",fontSize: "11pt"}}>
                    <Card.Header  style={{textAlign: "center", fontSize: "12pt", color: "#01579b"}}>
                        <FontAwesomeIcon icon={this.state.id ? faEdit : faPlusCircle} size="lg" className="mr-2"/>
                        <b style={{color: "#01579b"}}>{this.state.id ? "Редактирование" : "Новая запись"}</b>
                    </Card.Header>
                    <Form onReset={this.resetTask}
                          onSubmit={this.state.id ? this.updateTask : this.submitTask}
                          id="taskFormId">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridTaskName">
                                    <Form.Label>Название</Form.Label>
                                    <Form.Control required autoComplete="off"
                                                  type="text" name="taskName"
                                                  value={taskName} onChange={this.taskChange}
                                                  placeholder="Введите название заявки" />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridTaskLink">
                                    <Form.Label>Ссылка</Form.Label>
                                    <Form.Control required autoComplete="off"
                                                  type="test" name="taskLink"
                                                  value={taskLink} onChange={this.taskChange}
                                                  placeholder="Введите ссылку на заявку" />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridPlace">
                                    <Form.Label>Среда тестирования</Form.Label>
                                    <Form.Control required as="select"
                                                  custom onChange={this.taskChange}
                                                  name="place" value={place}>
                                        {this.state.places.map(place =>
                                            <option key={place.value} value={place.value}>
                                                {place.display}
                                            </option>
                                        )}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridHours">
                                    <Form.Label>Количество часов</Form.Label>
                                    <Form.Control required autoComplete="off"
                                                  type="test" name="hours"
                                                  value={hours} onChange={this.taskChange}
                                                  placeholder="Введите количество часов для тестирования" />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridAmountErrors">
                                    <Form.Label>Количество ошибок</Form.Label>
                                    <Form.Control required autoComplete="off"
                                                  type="test" name="amountErrors"
                                                  value={amountErrors} onChange={this.taskChange}
                                                  placeholder="Введите количество ошибок" />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridMark">
                                    <Form.Label>Сложность</Form.Label>
                                    <Form.Control required autoComplete="off"
                                                  type="test" name="mark"
                                                  value={mark} onChange={this.taskChange}
                                                  placeholder="Оцените сложность заявки" />
                                </Form.Group>
                            </Form.Row>
                        </Card.Body>
                        <Form.Group className="text-right mt-5 mb-4 ml-2" as={Row}>
                            <Button variant="info" type="button" onClick={this.taskList.bind()}
                                    style={{marginRight: "300px", marginLeft: "10px"}}>
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2"/> Отмена
                            </Button>
                            <Button variant="info" type="reset" className="mr-2">
                                <FontAwesomeIcon icon={faUndo} className="mr-2"/> Очистить
                            </Button>
                            <Button variant="success" type="submit" className="mr-2">
                                <FontAwesomeIcon icon={faSave} className="mr-2"/> {this.state.id ? "Обновить" : "Сохранить"}
                            </Button>
                        </Form.Group>
                    </Form>
                    </Card>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        savedTaskObject: state.task,
        taskObject: state.task,
        updatedTaskObject: state.task
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveTask: (task) => dispatch(saveTask(task)),
        fetchTask: (taskId) => dispatch(fetchTask(taskId)),
        updateTask: (task) => dispatch(updateTask(task))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainBaseAdd);
