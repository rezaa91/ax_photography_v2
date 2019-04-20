import Validate from '../Validate';

test('date format returns dd-mm-yyyy', () => {
    expect(Validate.validateDate('14 jan 91')).toBe('14-Jan-1991');
});

test('Validate date to return null if no argument passed', () => {
    expect(Validate.validateDate()).toBeNull();
})

test('Invalid data types results in null when validateDate() is called', () => {
    expect(Validate.validateDate(1213)).toBeNull();
    expect(Validate.validateDate(15.168)).toBeNull();
    expect(Validate.validateDate(false)).toBeNull();
    expect(Validate.validateDate(true)).toBeNull();
    expect(Validate.validateDate(['test', false, 123])).toBeNull();
    expect(Validate.validateDate({})).toBeNull();
    expect(Validate.validateDate({Date: 'random', num: 123.111})).toBeNull();
    expect(Validate.validateDate(null)).toBeNull();
})
