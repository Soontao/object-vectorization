import { CDS, ElementDefinition, EntityDefinition, cwdRequireCDS } from "cds-internal-tool";
import CategoryEncoder from "./CategoryEncoder";
import { ANNOTATIONS, SUPPORTED_TYPES } from "./constants";

type Predictor<T> = (value: T) => boolean;

export function multiFilter<T>(values: Array<T>, predictors: Array<Predictor<T>>) {
  const rtValues: Array<Array<T>> = predictors.map(() => []);

  for (const value of values) {
    for (const [index, predictor] of predictors.entries()) {
      if (predictor(value)) {
        rtValues[index].push(value);
      }
    }
  }
  return rtValues;
}

export async function calculateVectorForObject(meta: EntityDefinition, where: any): Float32Array {
  // calculate vector length
  const cds = cwdRequireCDS();
  const { SELECT } = cds.ql;
  const [keys, types, categories, unfolds] = _extractVectorKeysAndTypes(meta);
  for (const category of categories) {
    if (category.isAssociation) {
    } else {
      const allValues = await _createEncodersForCategories(cds, SELECT, meta, [category]);
    }
  }
  const data = await cds.run(SELECT.one.from(meta).where(where));
}

async function _createEncodersForCategories(
  cds: CDS,
  SELECT: CDS["ql"]["SELECT"],
  meta: EntityDefinition,
  categories: Array<ElementDefinition>,
) {
  const allValuesForAllCategory: Array<Array<any>> = await cds
    .run(
      SELECT.distinct
        .from(meta)
        .columns(...categories.map((c) => c.name))
        .orderBy(...categories.map((c) => `${c.name} asc`)),
    )
    .then((rs) => rs.map((v: any) => categories.map((c) => v[c.name])));
  const rt = new Map<ElementDefinition, CategoryEncoder>();
  for (const [index, category] of categories.entries()) {
    const allValues = allValuesForAllCategory[index];
    rt.set(category, new CategoryEncoder(allValues));
  }
  return rt;
}

function _extractVectorKeysAndTypes(meta: EntityDefinition) {
  return multiFilter(Object.values(meta.elements), [
    (e) => e[ANNOTATIONS.KEY] == true,
    (e) => e[ANNOTATIONS.TYPE],
    (e) => e[ANNOTATIONS.TYPE] == SUPPORTED_TYPES.category,
    (e) => e[ANNOTATIONS.TYPE] == SUPPORTED_TYPES.unfold,
  ]);
}

export default calculateVectorForObject;
