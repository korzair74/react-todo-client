import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import axios from "axios";

import TodoItem from "./todoitem";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      todo: "",
      todos: [],
    };
  }

  handleChange = (e) => {
    this.setState({
      todo: e.target.value,
    });
  };

  addTodo = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      // url: "http://localhost:5000/todo",
      url: "https://cmn-flask-todo-api.herokuapp.com/todo",
      headers: { "content-type": "application/json" },
      data: {
        title: this.state.todo,
        done: false,
      },
    })
      .then((res) => {
        this.setState({
          todos: [...this.state.todos, res.data],
          todo: "",
        });
      })
      .catch((err) => {
        console.log("Add Todo error", err);
      });
  };
  deleteTodo = (id) => {
    // fetch(`http://localhost:5000/todo/${id}`
    fetch(`https://cmn-flask-todo-api.herokuapp.com/todo/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        this.setState({
          todos: this.state.todos.filter((todo) => {
            return todo.id !== id;
          }),
        });
      })
      .catch((err) => {
        console.log("Delete Todo Error", err);
      });
  };

  componentDidMount() {
    // fetch("http://localhost:5000/todos")
    fetch("https://cmn-flask-todo-api.herokuapp.com/todos")
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          todos: data,
        });
      })
      .catch((err) => {
        console.log("FetchTodos Error:", err);
      });
  }
  renderTodos = () => {
    return this.state.todos.map((todo) => {
      return (
        <TodoItem key={todo.id} todoData={todo} deleteTodo={this.deleteTodo} />
      );
    });
  };

  render() {
    return (
      <div className='app'>
        <h1>ToDo List</h1>
        <form className='add-todo' onSubmit={this.addTodo}>
          <input
            type='text'
            placeholder='  Add Todo'
            onChange={this.handleChange}
            value={this.state.todo}
          />
          <button type='submit'>Add</button>
        </form>
        {this.renderTodos()}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
