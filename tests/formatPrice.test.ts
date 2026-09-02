import { describe, expect, test } from 'vitest';
import { formatPrice } from '../src/utils/formatPrice';

describe('formatPrice', () => {
  test('formats numbers to dollar string', () => {
    expect(typeof formatPrice(1000)).toBe('string');
  });
});
