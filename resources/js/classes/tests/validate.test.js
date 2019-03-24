import Validate from '../Validate';

test('date format returns dd-mm-yyyy', () => {
    const date = new Date('14 jan 91');
    expect(Validate.validateDate(date)).toBe('14-Jan-1991');
});

