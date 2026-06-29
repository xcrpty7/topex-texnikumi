const paginate = async (Model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 12,
    sort = { createdAt: -1 },
    populate = null,
    select = null,
  } = options;

  const safePage = Math.max(1, parseInt(page) || 1);
  const safeLimit = Math.min(Math.max(1, parseInt(limit) || 12), 100);
  const skip = (safePage - 1) * safeLimit;
  const total = await Model.countDocuments(query);

  let dbQuery = Model.find(query).sort(sort).skip(skip).limit(safeLimit);

  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((p) => { dbQuery = dbQuery.populate(p); });
    } else {
      dbQuery = dbQuery.populate(populate);
    }
  }

  if (select) dbQuery = dbQuery.select(select);

  const data = await dbQuery;

  return {
    data,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      pages: Math.ceil(total / safeLimit),
    },
  };
};

module.exports = paginate;
