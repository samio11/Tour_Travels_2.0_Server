import { AppError } from "../../errors/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTourType = async (payload: ITourType) => {
  const existTour = await TourType.findOne({ name: payload.name });
  if (existTour) {
    throw new AppError(401, "Tour Type is already Exists");
  }
  const newTourType = await TourType.create(payload);
  return newTourType;
};
const createTour = async (payload: ITour) => {
  const existTour = await Tour.findOne({ name: payload.title });
  if (existTour) {
    throw new AppError(401, "Tour is already Exists");
  }
  const newTourType = await Tour.create(payload);
  return newTourType;
};

const getAllTourType = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(TourType.find(), query)
    .filter()
    .search(["name"])
    .sort()
    .paginate()
    .fields();
  const tourTypeData = await queryBuilder.build();
  return tourTypeData;
};
const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query)
    .filter()
    .search(["title"])
    .sort()
    .paginate()
    .fields();
  const tourData = await queryBuilder
    .build()
    .populate("tourType")
    .populate("division");
  return tourData;
};

const getATourType = async (id: string) => {
  const tourTypeExists = await TourType.findById(id);
  if (!tourTypeExists) {
    throw new AppError(401, "This Tour Type Not Exists");
  }
  return tourTypeExists;
};
const getATour = async (slug: string) => {
  const tourExists = await Tour.findOne({ slug });
  if (!tourExists) {
    throw new AppError(401, "This Tour Not Exists");
  }
  return tourExists;
};
const deleteATourType = async (id: string) => {
  const deletedTour = await TourType.findByIdAndDelete(id);
  return deletedTour;
};
const deleteATour = async (id: string) => {
  const deletedTour = await Tour.findByIdAndDelete(id);
  return deletedTour;
};

export const tourServices = {
  createTourType,
  getAllTourType,
  getATourType,
  createTour,
  getAllTour,
  getATour,
  deleteATourType,
  deleteATour,
};
