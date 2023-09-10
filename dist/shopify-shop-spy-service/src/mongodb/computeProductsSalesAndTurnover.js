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
var computeProductsSalesAndTurnover_exports = {};
__export(computeProductsSalesAndTurnover_exports, {
  computeProductsSalesAndTurnover: () => computeProductsSalesAndTurnover,
  lookupProducts: () => lookupProducts,
  lookupSales: () => lookupSales,
  projectClean: () => projectClean,
  projectPopulate: () => projectPopulate
});
module.exports = __toCommonJS(computeProductsSalesAndTurnover_exports);
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
function projectPopulate() {
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
            array: "$$array",
            total: {
              $map: {
                input: "$$array",
                as: "product",
                in: {
                  url: "$$product.url",
                  sales: "$$product.totalSales",
                  turnover: {
                    $multiply: ["$$product.price", "$$product.totalSales"]
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
function projectClean() {
  const document = {
    $project: {
      _id: 0,
      sales: 0,
      products: {
        _id: 0,
        shopId: 0
      }
    }
  };
  return document;
}
const computeProductsSalesAndTurnover = async (shop) => {
  const { url } = shop;
  const last7Days = (0, import_dayjs.default)().subtract(7, "day").startOf("day").unix();
  const shopsCollection = (0, import_collections.getShopsCollection)();
  const data = await shopsCollection.aggregate([
    {
      $match: { url }
    },
    ...[lookupProducts(), lookupSales(last7Days), projectPopulate()],
    projectClean()
  ]).toArray();
  const productsCollection = (0, import_collections.getShopProductsCollection)();
  const products = data[0].products.total;
  for (let index = 0; index < products.length; index += 10) {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      const product = products[index + i];
      if (product) {
        promises.push(
          productsCollection.updateOne(
            { url: product.url },
            {
              $set: {
                last7DaysSales: product.sales,
                last7DaysTurnover: product.turnover
              }
            }
          )
        );
      }
    }
    await Promise.all(promises);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  computeProductsSalesAndTurnover,
  lookupProducts,
  lookupSales,
  projectClean,
  projectPopulate
});
//# sourceMappingURL=computeProductsSalesAndTurnover.js.map
