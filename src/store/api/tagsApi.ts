import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Tag } from '../../types';
import { API_BASE } from '../../utils/constants';

export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  tagTypes: ['Tag'],
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => '/tags',
      providesTags: (result) => {
        const tags = Array.isArray(result) ? result : [];
        return [
          ...tags.map(({ id }) => ({ type: 'Tag' as const, id })),
          { type: 'Tag', id: 'LIST' },
        ];
      },
    }),

    createTag: builder.mutation<Tag, { name: string }>({
      query: (body) => ({
        url: '/tags',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
    }),
  }),
});

export const { useGetTagsQuery, useCreateTagMutation } = tagsApi;
