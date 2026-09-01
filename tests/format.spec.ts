import { describe, it, expect } from 'vitest';
import { formatPrice } from '../src/utils/format';

describe('formatPrice', () => {
  it('formats numbers to dollar string', () => {
    expect(formatPrice(1000)).toBe('$1000');
    expect(formatPrice(12.3)).toBe('$12');
  });
});
