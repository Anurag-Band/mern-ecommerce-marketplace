// base ->> Product.find()
// base ->> Product.find(email: {"hitesh@lco.dev"})

// bigQ ->> /search=coder&page=2&category=shortsleeves&rating[gte]=4
// &price[lte]=999&price[gte]=199&limit=5

class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchword = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchword });
    return this;
  }

  filter() {
    const copyQ = { ...this.bigQ };

    // Removing some fields for category
    const removeFields = ["search", "page", "limit"];

    removeFields.forEach((key) => delete copyQ[key]);

    // Filter For Price and Rating

    let stringOfCopyQ = JSON.stringify(copyQ);

    stringOfCopyQ = stringOfCopyQ.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (key) => `$${key}`
    );

    const jsonOfCopyQ = JSON.parse(stringOfCopyQ);
    this.base = this.base.find(jsonOfCopyQ);
    return this;
  }

  pager(resultPerPage) {
    let currentPage = 1;

    if (this.bigQ.page) {
      currentPage = this.bigQ.page;

      const skipVal = resultPerPage * (currentPage - 1);

      this.base = this.base.limit(resultPerPage).skip(skipVal);
      return this;
    }
  }
}

module.exports = WhereClause;
