'use client';

import * as React from 'react';

import { dayjs } from '@/lib/dayjs';
import { tasksData } from '@/lib/tasks/tasks';
import { DefaultLimit, TaskStatus } from '@/types/common';
import { TasksProvider } from './tasks-context';
import { TasksView } from './tasks-view';
import { Column, Task, taskSDK } from './types';

const columns = [
  { id: 'COL-001', name: 'Todo', taskIds: ['TSK-001', 'TSK-002'] },
  { id: 'COL-002', name: 'Progress', taskIds: [] },
  { id: 'COL-003', name: 'Done', taskIds: ['TSK-003', 'TSK-004'] },
] satisfies Column[];

export default function TaskPage(): React.JSX.Element {
  const [rows, setRows] = React.useState<Task[]>([]);

  const [columns, setColumns] = React.useState<Column[]>([]);
  const [limit, setLimit] = React.useState<number>(DefaultLimit);
  const [page, setPage] = React.useState<number>(0);
  const [dataCount, setDataCount] = React.useState<number>(0);

  const fetchTaskList = async (pageData: number, limitData: number) => {
    setRows([]);

    const post: any = {
      find: {}
    };


    const { data, error } = await tasksData.list(post);
    if (error || !data?.success) {

    } else if (data?.success && data?.tasks) {

      const dataRows: Task[] = []
      data?.tasks?.map((task: taskSDK) => {
        dataRows.push({
          id: task._id,
          author: task.createdBy as any || {},
          title: task.title,
          description: task.description,
          columnId: task.status,
          createdAt: dayjs().subtract(3, 'day').toDate(),
          subscribed: true,
          assignees: task.assignee as any || [],
          attachments: [],
          subtasks: [],
          comments: [
          ],
        })
      })
      setRows(dataRows);
      const columnsData: { id: string, name: string, taskIds: string[] }[] = [];
      columnsData.push({
        id: TaskStatus.NOT_STARTED,
        name: 'To do',
        taskIds: data?.tasks
          .filter((item: any) => item.status === TaskStatus.NOT_STARTED) // Filter tasks by status
          .map((item: any) => item._id)
      })
      columnsData.push({
        id: TaskStatus.IN_PROGRESS,
        name: 'Progress',
        taskIds: data?.tasks
          .filter((item: any) => item.status === TaskStatus.IN_PROGRESS) // Filter tasks by status
          .map((item: any) => item._id)
      })
      columnsData.push({
        id: TaskStatus.COMPLETED,
        name: 'Done',
        taskIds: data?.tasks
          .filter((item: any) => item.status === TaskStatus.COMPLETED) // Filter tasks by status
          .map((item: any) => item._id)
      })
      console.log(columnsData)
      setColumns(columnsData as Column[])
      setDataCount(data?.count || 0);
    }

  };

  React.useEffect(() => {
    fetchTaskList(page, limit);
  }, [
    page, limit
  ]);
  return (
    <TasksProvider columns={columns} tasks={rows}>
      <TasksView />
    </TasksProvider>
  );
}
