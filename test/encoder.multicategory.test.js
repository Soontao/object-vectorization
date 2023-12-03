import { MultiCategoryEncoder } from "../src/encoders/MultiCategoryEncoder.js";

describe('MultiCategoryEncoder Test Suite', () => {

  it('should support encode with MultiCategoryEncoder', () => {
    const e = new MultiCategoryEncoder(["A", "B", "C"])
    expect(e.features("cat_1")).toMatchSnapshot()
    expect(e.encode(['A'])).toEqual([1, 0, 0])
    expect(e.encode(['A', "B"])).toEqual([1, 1, 0])
    expect(e.encode(['A', "B", "C"])).toEqual([1, 1, 1])
  });

  it('should support decode with MultiCategoryEncoder', () => {
    const e = new MultiCategoryEncoder(["A", "B", "C"])
    expect(e.decode(['A', "B", "C"])).toEqual([])
    expect(e.decode([0, 1, 1])).toEqual(["B", "C"])
  });


});
