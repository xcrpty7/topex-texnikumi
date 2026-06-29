const paginate = async (Model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 12,
    sort = { createdAt: -1 },
    populate = null,
    select = null,
  } = options;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Model.countDocuments(query);

  let dbQuery = Model.find(query).sort(sort).skip(skip).limit(parseInt(limit));

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
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

module.exports = paginate;
