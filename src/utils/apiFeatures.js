// Utils
import catchAsync from './catchAsync';
import AppError from './appError';

const apiFeatures = catchAsync(async (req, model, populate) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'filter'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = model.find(JSON.parse(queryStr));

  if (!query) {
    throw new AppError('No Data Found', 400);
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',');
    const obj = {};
    const number = Number(sortBy[0]);

    sortBy.forEach((field) => {
      obj[field] = number;
    });

    delete obj[sortBy[0]];

    query = query.sort(obj);
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  query = await query;

  const filterByValue = (array, value) =>
    array.filter(
      (data) =>
        JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );

  if (req.query.filter) {
    const filter = req.query.filter.split(',').join(' ');
    return filterByValue(query, filter);
  }

  return query;
});

export default apiFeatures;
