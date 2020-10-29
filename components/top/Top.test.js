import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { ajax } from 'rxjs/ajax';
import { Observable, of } from 'rxjs';

import Top from './Top';

describe('Top', () => {
  const originalAjaxGet = ajax.getJSON;

  afterEach(() => {
    ajax.getJSON = originalAjaxGet;
  });

  test('renders loading', () => {
    const { container, debug } = render(<Top />);
    expect(container.querySelector('.loading')).not.toBeNull();
  });

  test('renders table', async () => {
    const mockResponse = jest.fn(() => {
      return of({ RAW: {} })
    });
    ajax.getJSON = mockResponse;
    const { container, debug } = render(<Top />);
    await waitFor(() => expect(container.querySelector('.table')).not.toBeNull());
    expect(mockResponse).toHaveBeenCalled();
  });
});
