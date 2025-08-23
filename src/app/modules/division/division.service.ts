import { AppError } from "../../errors/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
  const existDivision = await Division.findOne({ name: payload.name });
  if (existDivision) {
    throw new AppError(401, "Division is already created");
  }
  const division = await Division.create(payload);
  return division;
};

const getAllDivision = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Division.find(), query)
    .filter()
    .search(["name"])
    .sort()
    .paginate()
    .fields();
  const divisionData = await queryBuilder.build();
  return divisionData;
};
const getADivision = async (slug: string) => {
  const divisionData = await Division.findOne({ slug: slug });
  if (!divisionData) {
    throw new AppError(401, "Division not found");
  }
  return divisionData;
};

const deleteDivision = async (id: string) => {
  const result = await Division.findByIdAndDelete(id);
  return result;
};

export const divisionService = {
  createDivision,
  getAllDivision,
  getADivision,
  deleteDivision,
};
