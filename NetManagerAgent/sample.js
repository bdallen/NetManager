/**
 * Created by brendonallen on 2/02/16.
 */
export default function createPurchaseLogic({models: {ProductGroup}}) {
    function getRequiredProductsForPurchase(selectedProducts, initialPurchase, building, ip, coupon) {
        return ProductGroup.getProductsWithCoupon(ip, coupon, building.code).then((products) => {
            return products.filter((p) => {
                return (p.options.required && p.options.initialOnly === initialPurchase)
                    || selectedProducts.indexOf(p.id) > -1;
            });
        });
    }
    function getTotalValueOfProducts(products) {
        return {
            products,
            total: products.reduce((value, current, index, arr) => {
                return value + current.value;
            }, 0),
        };
    }
​
    ​
  function purchase(transaction, selectedProducts, user, billingAddress, building, initialPurchase, ip, coupon) {
      return getRequiredProductsForPurchase(selectedProducts, initialPurchase, building, ip, coupon)
          .then(getTotalValueOfProducts)
          .then(({products, total}) => {
              if (total > 0) {
                  return eway();
              }
              return true;
          }).then(() => {
              return updatePlanDetails()
          });
  }
​
    ​
    ​
  return {
      getRequiredProductsForPurchase,
      purchase,
  };
}