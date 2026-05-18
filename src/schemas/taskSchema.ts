import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Заголовок обязателен')
    .min(5, 'Минимум 5 символов'),
  description: z
    .string()
    .max(500, 'Максимум 500 символов')
    .optional()
    .or(z.literal('')),
  status: z.enum(['todo', 'inProgress', 'done'], {
    message: 'Выберите статус',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    message: 'Выберите приоритет',
  }),
  deadline: z.string().min(1, 'Укажите дедлайн'),
  tags: z.array(z.string()).min(1, 'Выберите минимум 1 тег'),
});

export type TaskFormSchema = z.infer<typeof taskFormSchema>;
