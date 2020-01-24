import express from "express";
import db from "../db/database";
import Source from "../domain/source";
import AliRequest from "../domain/alirequest";
import AliQueue from "../domain/aliqueue";
import callApifyMain from "../services/main";

const uuidv1 = require('uuid/v1');

var moment = require('moment');

const router = express.Router();

router.post("/products", (req, res, next) => {
    let products = req.body.products;
    let lang = '';

    products.map((product, key) => {
        switch(product.language){
            case "IT":
                lang = "IT";
                break;
            case "ES":
                lang = "ES";
                break;
            case "FR":
                lang = "FR";
                break;
            case "DE":
                lang = "DE";
                break;
            case "NL":
                lang = "NL";
                break;
            case "PT":
                lang = "PT";
                break;
            case "PL":
                lang = "PL";
                break;
            case "TR":
                lang = "TR";
                break;
            case "RU":
                lang = "RU";
                break;
            case "TH":
                lang = "TH";
                break;
            default:
            case "EN":
                lang = "EN";
                break;
        }

        db.query(Source.getSourceByFieldNameSQL('store_language'), [lang], (err, data) => {
            if(!err) {
                if(data && data.length > 0) {
                    let domain = data[0].store_url
                    let params = {
                        uuid: uuidv1(),
                        num_products: key,
                        created_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                        updated_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")
                    }
                    let aliRequest = new AliRequest()
                    db.query(aliRequest.getAddAliRequestSQL(), params, (err, data) => {
                        let params = {
                            uuid: uuidv1(),
                            product_code: product.code.toString(),
                            language: lang,
                            product_info_payload: null,
                            status: "READY",
                            failed_at: '2008-01-01 00:00:01',
                            imported: 0,
                            reserved_at: '2008-01-01 00:00:01',
                            finished_at: '2008-01-01 00:00:01',
                            created_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                            updated_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")
                        }
                        let aliQueue = new AliQueue();
                        db.query(aliQueue.getAddAliQueueSQL(), params, (err, data) => {
                            let startUrl =  domain + 'item/' + product.code + '.html';
                            db.query(AliQueue.getAliQueueByFieldNameSQL('status'), ['READY'], (err, data)=>{
                                data.map((d, key)=>{
                                    if (d.product_code === product.code.toString()){
                                        let params = [
                                            'RESERVED', 
                                            moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"), 
                                            product.code.toString()
                                        ];
                                        let fields = 'status = ?, reserved_at = ?';
                                        let condition = 'product_code = ?';
                                        db.query(AliQueue.updateAliQueueByFieldNameSQL(fields, condition), params, (err, data) => {
                                            callApifyMain(startUrl);
                                        });
                                    }
                                });
                            });
                        });
                    });
                }
            }
        })
    })
    res.status(200).json({
        message: "Ok"
    })
})

module.exports = router;