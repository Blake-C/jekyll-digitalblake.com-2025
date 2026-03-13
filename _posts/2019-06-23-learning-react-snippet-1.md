---
layout: post
title: "Learning React Snippet (1)"
date: 2019-06-23 11:33:42 -0500
modified_date: 2020-10-02 21:09:52 -0500
description: "Snippet from React learning course."
categories: ["Snippets"]
tags: ["javascript", "react"]
image: "/assets/uploads/2019/06/react-screen-facebook.webp"
---

## Notes for myself

Course: [https://scrimba.com/p/p7P5Hd](https://scrimba.com/p/p7P5Hd)  

    Private Repo:
    [https://github.com/Blake-C/freecodecamp-learn-react-js-full-course-for-beginners-tutorial-2019](https://github.com/Blake-C/freecodecamp-learn-react-js-full-course-for-beginners-tutorial-2019)  

    React Docs: [https://reactjs.org/](https://reactjs.org/)

App Start:

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Todo from './components/Todo/Todo'

ReactDOM.render(<todo></todo>, document.getElementById('root'))
```

App Class Component:

```js
import React, { Component } from 'react'
import TodoItem from './TodoItem/TodoItem'
import todosData from './todosData'
import './todo.scss'

class Todo extends Component {
    state = {
        data: todosData,
    }

    handleOnChange = id => {
        this.setState(prevState => {
            const newState = prevState.data.map(item => {
                if (item.id === id) {
                    item.completed = !item.completed
                }
                return item
            })

            return {
                data: newState,
            }
        })
    }

    render() {
        const todoElements = this.state.data.map(data => {
            return (
                <todoitem data="{data}" handleonchange="{this.handleOnChange}" key="{data.id}"></todoitem>
            )
        })

        return <form classname="todo">{todoElements}</form>
    }
}

export default Todo
```

App Functional Component:

```js
import React from 'react'
import PropTypes from 'prop-types'

function TodoItem(props) {
    const { id, completed, text } = props.data

    return (
        <div classname="todo-item">
            <label htmlfor="{`item_${id}`}">
                <input =="" checked="{completed}" id="{`item_${id}`}" onchange="{()" type="checkbox"/> {
                        props.handleOnChange(id)
                    }}
                />
                {text}
            </label>
            <br/>
        </div>
    )
}

// PropTypes
TodoItem.propTypes = {
    data: PropTypes.object.isRequired,
    handleOnChange: PropTypes.func.isRequired,
}

export default TodoItem
```

App Data:

```js
const todosData = [
    {
        id: 1,
        text: 'Take out the trash',
        completed: true,
    },
    {
        id: 2,
        text: 'Grocery shopping',
        completed: false,
    },
    {
        id: 3,
        text: 'Clean gecko tank',
        completed: false,
    },
    {
        id: 4,
        text: 'Mow lawn',
        completed: true,
    },
    {
        id: 5,
        text: 'Catch up on Arrested Development',
        completed: false,
    },
]

export default todosData
```
