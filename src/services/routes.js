// routes.js
const Apify = require('apify');
const extractors = require('./extractors');
var moment = require('moment');

import db from "../db/database";
import AliQueue from "../domain/aliqueue";
import Store from "../domain/store";

const {
    utils: { log },
} = Apify;

// Categoy page crawler
// Add next page on request queue
// Fetch products from list and add all links to request queue
exports.CATEGORY = async ({ $, request }, { requestQueue }) => {
    log.info(`CRAWLER -- Fetching category link: ${request.url}`);

    // Extract sub category links
    const subCategories = await extractors.getAllSubCategories($);

    // If sub categories are more than 0
    if (subCategories.length > 0) {
        // Add all sub categories to request queue
        for (const subCategory of subCategories) {
            await requestQueue.addRequest({
                uniqueKey: subCategory.link,
                url: subCategory.link,
                userData: {
                    label: 'CATEGORY',
                },
            });
        }
    } else {
        // Move to listing
        await requestQueue.addRequest({
            uniqueKey: `${request.url}-LIST`,
            url: request.url,
            userData: {
                label: 'LIST',
                pageNum: 1,
                baseUrl: request.url,
            },
        });
    }


    log.debug(`CRAWLER -- Fetched ${subCategories.length} subcategories and moving to each of them`);
};

// Categoy page crawler
// Add next page on request queue
// Fetch products from list and add all links to request queue
exports.LIST = async ({ $, userInput, request }, { requestQueue }) => {
    const { endPage = -1 } = userInput;
    const { pageNum = 1, baseUrl } = request.userData;

    log.info(`CRAWLER -- Fetching category: ${request.url} with page: ${pageNum}`);

    // Extract product links
    const productLinks = await extractors.getProductsOfPage($);

    // If products are more than 0
    if (productLinks.length > 0) {
        // Check user input
        if (endPage > 0 ? pageNum + 1 <= endPage : true) {
            // Add next page of same category to queue
            await requestQueue.addRequest({
                url: `${baseUrl}?page=${pageNum + 1}&SortType=total_tranpro_desc`,
                userData: {
                    label: 'LIST',
                    pageNum: pageNum + 1,
                    baseUrl,
                },
            });
        }


        // Add all products to request queue
        for (const productLink of productLinks) {
            await requestQueue.addRequest({
                uniqueKey: `${productLink.id}`,
                url: `https:${productLink.link}`,
                userData: {
                    label: 'PRODUCT',
                    productId: productLink.id,
                },
            }, { forefront: true });
        }
    } else {
        // End of category with page
        log.debug(`CRAWLER -- Last page of category: ${request.url} with page: ${pageNum}.`);
    }


    log.debug(`CRAWLER -- Fetched product links from ${request.url} with page: ${pageNum}`);
};


// Product page crawler
// Fetches product detail from detail page
exports.PRODUCT = async ({ $, userInput, request }, { requestQueue }) => {
    const { productId } = request.userData;
    const { includeDescription } = userInput;
    let product = ''
    log.info(`CRAWLER -- Fetching product: ${productId}`);

    // Fetch product details
    try {
        product = await extractors.getProductDetail($, request.url);
    } catch (error) {
        await new Promise((resolve, reject) => {
            let params = [
                'FAILED', 
                moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"), 
                productId.toString()
            ];
            let fields = 'status = ?, failed_at = ?';
            let condition = 'product_code = ?';
            db.query(AliQueue.updateAliQueueByFieldNameSQL(fields, condition), params, (err, data)=>{
                resolve();
            });
        });
    } finally {
        // Check description option
        if (includeDescription) {
            // Fetch description
            await requestQueue.addRequest({
                url: product.descriptionURL,
                userData: {
                    label: 'DESCRIPTION',
                    product,
                },
            }, { forefront: true });
        } else {
            await new Promise((resolve, reject) => {
                let params = {
                    store_id: product['store']['id'],
                    store_name: product['store']['name'],
                    store_url: product['store']['url'],
                    store_feedbacks: parseFloat(product['store']['positiveRate']),
                    seller_since: moment(product['store']['establishedAt'], 'MMM D, YYYY').format('YYYY-MM-DD'),
                    created_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                    modified_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")
                };
                let store = new Store();
                db.query(store.getAddStoreSQL(), params, (err, data) => {
                    let params = [
                        'FINISHED', 
                        moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"), 
                        JSON.stringify(product),
                        productId.toString()
                    ];
                    let fields = 'status = ?, finished_at = ?, product_info_payload = ?';
                    let condition = 'product_code = ?';
                    db.query(AliQueue.updateAliQueueByFieldNameSQL(fields, condition), params, (err, data)=>{
                        resolve();
                    });
                });
            });
            await Apify.pushData({ ...product });
            console.log(`CRAWLER -- Fetching product: ${productId} completed and successfully pushed to dataset`);
        }
    }
    
};

// Description page crawler
// Fetches description detail and push data
exports.DESCRIPTION = async ({ $, request }) => {
    const { product } = request.userData;

    log.info(`CRAWLER -- Fetching product description: ${product.id}`);

    // Fetch product details
    const description = await extractors.getProductDescription($);
    product.description = description;
    delete product.descriptionURL;

    // Push data
    await Apify.pushData({ ...product });

    log.debug(`CRAWLER -- Fetching product description: ${product.id} completed and successfully pushed to dataset`);
};
