const products = [
    {
        id: 'hPc8YUbFuZM9edw4DaxwHk',
        name: 'Getting Started with React',
        price: 90.0,
        featuredImage: 'masterclass_react.png',
        description:
            'Get quickly up and running with React and create a profile website in just 3 hours!'
    },
    {
        id: 'eyryDtCCu9UUcqe9XgjbRk',
        name: 'AI with TensorFlow & Python',
        price: 90.0,
        featuredImage: 'masterclass_ai.png',
        description:
            'Create a machine learning model using Python and TensorFlow, focusing on image recognition and classification.'
    },
    {
        id: '6oC1Akf6EbcxWZXHQYNFwx',
        name: 'Game Development with Unity',
        price: 360.0,
        featuredImage: 'masterclass_game.png',
        requiresDeposit: true,
        description:
            'Create a clone of the popular 2D platformer featuring an Italian plumber, starting from scratch and covering all aspects of game development.'
    },
    {
        id: 'w6wTWMx39zcBiTdpM9w5J7',
        name: 'Introduction to CSS FlexBox',
        price: 90.0,
        featuredImage: 'masterclass_css.png',
        description:
            'FlexBox can revolutionise how you create responsive websites. Learn how in just 3 hours!'
    }
];

export const productsById = products.reduce((byId, p) => Object.assign(byId, { [p.id]: p}), {});

export default (req, res, next) => {
    res.locals.productsContext = {
        products: products,
        productsById: productsById
    };
    next();
};
