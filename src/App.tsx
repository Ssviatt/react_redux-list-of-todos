/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Todo } from './types/Todo';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';

import { getTodos } from './api';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { actions as todoActions } from './features/todos';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const allTodo = useAppSelector(state => state.todos);
  const setAllTodo = (todos: Todo[]) => dispatch(todoActions.add(todos));
  const formItems = useAppSelector(state => state.filter);

  const [isLoading, setIsLoading] = useState(false);
  const [filterTodo, setFilterTodo] = useState(allTodo);
  const [visibleTodo, setVisibleTodo] = useState(filterTodo);
  const [selectUserId, setSelectUserId] = useState(0);
  const [selectTodoId, setSelectTodoId] = useState(0);
  const selectItems = (UserId: number, todoId: number) => {
    setSelectUserId(UserId);
    setSelectTodoId(todoId);
  };

  const handleSelect = () => {
    switch (formItems.statusSelect) {
      case 'active':
        setFilterTodo(allTodo.filter(todo => !todo.completed));
        break;

      case 'completed':
        setFilterTodo(allTodo.filter(todo => todo.completed));
        break;

      default:
        setFilterTodo(allTodo);
    }
  };

  const handleSearch = () => {
    setVisibleTodo(filterTodo.filter(todo => todo.title.toLocaleLowerCase().trim()
      .includes(formItems.input.toLocaleLowerCase().trim())));
  };

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(res => setAllTodo(res))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    handleSelect();
  }, [formItems, allTodo]);

  useEffect(() => {
    handleSearch();
  }, [filterTodo, formItems]);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter />
            </div>

            <div className="block">
              {isLoading ? <Loader /> : (
                <>
                  {visibleTodo.length ? (
                    <TodoList
                      todos={visibleTodo}
                      selectTodo={selectTodoId}
                      selectItems={selectItems}
                    />
                  ) : (
                    <p className="notification is-warning">
                      There are no todos matching current filter criteria
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectUserId && (
        <TodoModal
          selectUser={selectUserId}
          selectTodo={selectTodoId}
          selectItems={selectItems}
        />
      )}
    </>
  );
};
