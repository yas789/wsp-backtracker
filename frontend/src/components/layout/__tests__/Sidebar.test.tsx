import { render, screen, within } from '../../../test-utils';
import Sidebar from '../Sidebar';

const hasBadge = (name: RegExp) =>
  within(screen.getByRole('link', { name })).queryByText('✓') !== null;

describe('Sidebar', () => {
  afterEach(() => localStorage.clear());

  it('marks only the completed setup stages', () => {
    localStorage.setItem(
      'wspAppState',
      JSON.stringify({
        config: { steps: 2, users: 2 },
        constraints: [],
        authMatrix: [[1, 1], [1, 1]],
        solutions: [],
      }),
    );
    render(<Sidebar />);

    expect(hasBadge(/configuration/i)).toBe(true);
    expect(hasBadge(/authorization/i)).toBe(true);
    expect(hasBadge(/constraints/i)).toBe(false);
  });

  it('marks nothing before setup starts', () => {
    render(<Sidebar />);

    expect(hasBadge(/configuration/i)).toBe(false);
  });
});
