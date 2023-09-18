export default (req, res, next) => {
    const { cart } = req.session;
    if (!cart) return next();
    cart.warnings = [];
    if (cart.items.some(item => item.product.requiresDeposit)) {
        cart.warnings.push('One or more of your selected products requires a deposit.');
    }
    next();
};
