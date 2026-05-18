import { useEffect, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { tagsApi } from '../store/api/tagsApi';
import { mockTags } from './fixtures';

export function WithMockTags({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(tagsApi.util.upsertQueryData('getTags', undefined, mockTags));
  }, [dispatch]);
  return children;
}
