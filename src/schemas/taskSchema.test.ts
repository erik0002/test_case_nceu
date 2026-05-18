import { describe, it, expect } from 'vitest';
import { taskFormSchema } from './taskSchema';

const validData = {
  title: 'Валидный заголовок',
  description: 'Описание',
  status: 'todo' as const,
  priority: 'medium' as const,
  deadline: '2026-12-31',
  tags: ['react'],
};

describe('taskFormSchema', () => {
  it('accepts valid form data', () => {
    expect(taskFormSchema.safeParse(validData).success).toBe(true);
  });

  it('rejects title shorter than 5 characters', () => {
    const result = taskFormSchema.safeParse({ ...validData, title: 'abc' });
    expect(result.success).toBe(false);
  });

  it('rejects empty title', () => {
    const result = taskFormSchema.safeParse({ ...validData, title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects description longer than 500 characters', () => {
    const result = taskFormSchema.safeParse({
      ...validData,
      description: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('accepts empty description', () => {
    const result = taskFormSchema.safeParse({ ...validData, description: '' });
    expect(result.success).toBe(true);
  });

  it('rejects missing tags', () => {
    const result = taskFormSchema.safeParse({ ...validData, tags: [] });
    expect(result.success).toBe(false);
  });

  it('rejects missing deadline', () => {
    const result = taskFormSchema.safeParse({ ...validData, deadline: '' });
    expect(result.success).toBe(false);
  });
});
