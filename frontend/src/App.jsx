import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_TASKS = gql`
  query GetAllTasks {
    tasks {
      id
      title
      completed
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($createTaskInput: CreateTaskInput!) {
    createTask(createTaskInput: $createTaskInput) {
      id
      title
      completed
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($updateTaskInput: UpdateTaskInput!) {
    updateTask(updateTaskInput: $updateTaskInput){
      id
      completed
    }
  }
  `;

  const REMOVE_TASK = gql`
    mutation RemoveTask($id: Int!) {
      removeTask(id: $id){
        id
      }
    }
  `;

function AddTaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createTask, { loading, error }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask({ variables: { createTaskInput: { title , description } } });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>

        {/* <label htmlFor="title">タスクを入力する</label> */}
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスク"
        />

      {/* <div>
        <label htmlFor="description">タスクの詳細</label>
        <input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="タスクの詳細"
        />
      </div> */}

      <button className="primary" type="submit" disabled={loading}>
        {loading ? '追加中...' : '追加'}
      </button>
      {error && <p>エラー: {error.message}</p>}
    </form>
  );
}


function TaskList() {
  const { loading, error, data } = useQuery(GET_TASKS);
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [removeTask] = useMutation(REMOVE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const handleCompleteClick = (id) => {
    updateTask({
       variables: { 
        updateTaskInput: { 
          id: parseInt(id), 
          completed: true 
        } 
      } 
    });
  };

  const handleRemoveClick = (id) => {
    removeTask({
      variables: {
        id: parseInt(id)
      }
    })
  }

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  return (
    <ul>
      {data.tasks.map(({ id, title, completed }) => (
        <li key={id}>
          <p>
            {completed ? ('【 完了 】' ): ('【未完了】')}
            {title} 
          </p>
          <div className="action">
            {!completed && (<button onClick={() => handleCompleteClick(id)} className="complete">完了</button>)}
            <button onClick={() => handleRemoveClick(id)}>削除</button>
          </div>
        </li>
      ))}
    </ul>
  );

}




function App() {

  return (
    <main>
      <h1>ToDoリスト</h1>
      <AddTaskForm />
      <TaskList />
    </main>
  );
}

export default App;