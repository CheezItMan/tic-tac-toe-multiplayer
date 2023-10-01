
import { deepCopy } from "../util";

test('Can copy a simple object', () => {
  const simpleObj = {
    a: 'a',
    b: 2,
  };

  const answer = deepCopy(simpleObj);

  expect(simpleObj === answer).toBe(false);
  expect(simpleObj.a).toEqual(answer.a);
  expect(simpleObj.b).toEqual(answer.b);
});

test('can copy an array', () => {
  const sampleArray = ['boston', 'houston', 'dallas'];

  const answer = deepCopy(sampleArray);

  expect(sampleArray === answer).toBe(false);
  for (let i: number = 0; i < sampleArray.length; i++) {
    expect(sampleArray[i]).toEqual(answer[i])
  }
});

test('can copy nested data structure', () => {
  const sampleNestedObj = {
    a: 'a',
    b: {
      c: '2',
      d: '3',
    }
  };

  const answer = deepCopy(sampleNestedObj);

  expect(sampleNestedObj === answer).toBe(false);
  expect(sampleNestedObj.a).toEqual(answer.a);
  expect(sampleNestedObj.b === answer.b).toBeFalsy();
  expect(sampleNestedObj.b.c).toEqual(answer.b.c);
  expect(sampleNestedObj.b.d).toEqual(answer.b.d);
});



