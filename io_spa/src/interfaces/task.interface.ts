import { MetaInterface } from 'src/interfaces/meta.interface';

export interface TaskInterface {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TasksResultInterface {
  data?: Array<TaskInterface>;
  meta?: MetaInterface;
}
