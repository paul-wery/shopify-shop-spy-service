var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var computeSalesAndTurnover_exports = {};
__export(computeSalesAndTurnover_exports, {
  computeSalesAndTurnover: () => computeSalesAndTurnover,
  lookupProducts: () => lookupProducts,
  lookupSales: () => lookupSales,
  projectClean: () => projectClean,
  projectPopulate: () => projectPopulate
});
module.exports = __toCommonJS(computeSalesAndTurnover_exports);
var import_dayjs = __toESM(require("dayjs"));
var import_collections = require("./collections");
function lookupProducts() {
  const document = {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "shopId",
      as: "products"
    }
  };
  return document;
}
function lookupSales(from, to) {
  const document = {
    $lookup: {
      from: "sales",
      localField: "products.url",
      foreignField: "productUrl",
      let: { shopId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$shopId", "$$shopId"] },
                { $gte: ["$date", from] },
                ...to ? [{ $lte: ["$date", to] }] : []
              ]
            }
          }
        },
        {
          $sort: { date: 1 }
        }
      ],
      as: "sales"
    }
  };
  return document;
}
function projectPopulate(productsLimit) {
  const document = {
    $project: {
      id: {
        $toString: "$_id"
      },
      url: 1,
      name: 1,
      logo: 1,
      about: 1,
      currency: 1,
      theme: 1,
      sales: 1,
      createdAt: 1,
      products: {
        $let: {
          vars: {
            array: {
              $sortArray: {
                input: {
                  $map: {
                    input: "$products",
                    as: "product",
                    in: {
                      $let: {
                        vars: {
                          sales: {
                            $filter: {
                              input: "$sales",
                              as: "sale",
                              cond: {
                                $eq: ["$$sale.productUrl", "$$product.url"]
                              }
                            }
                          }
                        },
                        in: {
                          url: "$$product.url",
                          name: "$$product.name",
                          image: "$$product.image",
                          price: "$$product.price",
                          createdAt: "$$product.createdAt",
                          sales: "$$sales",
                          totalSales: {
                            $reduce: {
                              input: "$$sales",
                              initialValue: 0,
                              in: { $add: ["$$value", "$$this.count"] }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                sortBy: { totalSales: -1 }
              }
            }
          },
          in: {
            array: { $slice: ["$$array", productsLimit] },
            total: {
              $reduce: {
                input: "$$array",
                initialValue: { sales: 0, turnover: 0 },
                in: {
                  sales: {
                    $add: ["$$value.sales", "$$this.totalSales"]
                  },
                  turnover: {
                    $add: [
                      "$$value.turnover",
                      { $multiply: ["$$this.price", "$$this.totalSales"] }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  return document;
}
function projectClean({
  removeProductsArray = false
} = {}) {
  const document = {
    $project: {
      _id: 0,
      sales: 0,
      products: {
        _id: 0,
        shopId: 0,
        array: removeProductsArray ? 0 : {
          sales: {
            _id: 0,
            shopId: 0,
            productUrl: 0
          }
        }
      }
    }
  };
  return document;
}
const computeSalesAndTurnover = async (shop) => {
  const { url, updatedAt } = shop;
  const timeSinceLastUpdate = (0, import_dayjs.default)().diff(import_dayjs.default.unix(updatedAt), "h");
  const shouldUpdateProductsTotal = !updatedAt || timeSinceLastUpdate >= 1;
  if (!shouldUpdateProductsTotal)
    return;
  const shopsCollection = (0, import_collections.getShopsCollection)();
  const data = await shopsCollection.aggregate([
    {
      $match: { url }
    },
    ...[lookupProducts(), lookupSales(updatedAt), projectPopulate(0)],
    projectClean({ removeProductsArray: true })
  ]).toArray();
  const shopData = data[0];
  shop.turnover += shopData.products?.total.turnover || 0;
  shop.sales += shopData.products?.total.sales || 0;
  shop.updatedAt = (0, import_dayjs.default)().unix();
  await shopsCollection.updateOne({ _id: shop._id }, { $set: shop });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  computeSalesAndTurnover,
  lookupProducts,
  lookupSales,
  projectClean,
  projectPopulate
});
//# sourceMappingURL=computeSalesAndTurnover.js.map
