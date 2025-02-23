import { generateMatchDates } from '../../context/TournamentContext';

describe('generateMatchDates', () => {
  test('generates correct number of dates', () => {
    const dates = generateMatchDates(new Date('2025-02-25'));
    expect(dates).toHaveLength(12); // 6 matches per group
  });

  test('skips weekends', () => {
    const dates = generateMatchDates(new Date('2025-02-25'));
    dates.forEach(date => {
      const day = date.getDay();
      expect(day).not.toBe(0); // Sunday
      expect(day).not.toBe(6); // Saturday
    });
  });

  test('skips specific dates (March 3-4, 2025)', () => {
    const dates = generateMatchDates(new Date('2025-02-25'));
    const skipDates = ['2025-03-03', '2025-03-04'];
    
    dates.forEach(date => {
      const dateString = date.toISOString().split('T')[0];
      expect(skipDates).not.toContain(dateString);
    });
  });

  test('generates dates in correct order', () => {
    const dates = generateMatchDates(new Date('2025-02-25'));
    const expectedDates = [
      '2025-02-25', // Tue
      '2025-02-26', // Wed
      '2025-02-27', // Thu
      '2025-02-28', // Fri
      '2025-03-05', // Wed (skipping Mar 3-4)
      '2025-03-06', // Thu
      '2025-03-07', // Fri
      '2025-03-10', // Mon
      '2025-03-11', // Tue
      '2025-03-12', // Wed
      '2025-03-13', // Thu
      '2025-03-14', // Fri
    ];

    dates.forEach((date, index) => {
      expect(date.toISOString().split('T')[0]).toBe(expectedDates[index]);
    });
  });

  // New tests
  test('handles invalid start date by using default', () => {
    const dates = generateMatchDates(null);
    expect(dates[0].toISOString().split('T')[0]).toBe('2025-02-25');
  });

  test('all dates are valid Date objects', () => {
    const dates = generateMatchDates(new Date('2025-02-25'));
    dates.forEach(date => {
      expect(date instanceof Date).toBe(true);
      expect(date.toString()).not.toBe('Invalid Date');
    });
  });

  test('dates are consecutive excluding weekends and skip dates', () => {
    const dates = generateMatchDates(new Date('2025-02-25'));
    for (let i = 0; i < dates.length - 1; i++) {
      const currentDate = dates[i];
      const nextDate = dates[i + 1];
      const diffInDays = (nextDate - currentDate) / (1000 * 60 * 60 * 24);
      
      // Difference should be 1 day, except around weekends and skip dates
      if (diffInDays > 1) {
        // Verify that skipped days are either weekends or Mar 3-4
        const skippedDate = new Date(currentDate);
        skippedDate.setDate(skippedDate.getDate() + 1);
        while (skippedDate < nextDate) {
          const isWeekend = [0, 6].includes(skippedDate.getDay());
          const isSkipDate = ['2025-03-03', '2025-03-04'].includes(
            skippedDate.toISOString().split('T')[0]
          );
          expect(isWeekend || isSkipDate).toBe(true);
          skippedDate.setDate(skippedDate.getDate() + 1);
        }
      }
    }
  });

  test('all dates are at midnight UTC', () => {
    const dates = generateMatchDates(new Date('2025-02-25'));
    dates.forEach(date => {
      expect(date.getUTCHours()).toBe(0);
      expect(date.getUTCMinutes()).toBe(0);
      expect(date.getUTCSeconds()).toBe(0);
      expect(date.getUTCMilliseconds()).toBe(0);
    });
  });
}); 