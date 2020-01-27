import db from "../db/database";
import Source from "../domain/source";
import AliRequest from "../domain/alirequest";
import AliQueue from "../domain/aliqueue";
import callApifyMain from "../services/main";
const uuidv1 = require('uuid/v1');
var moment = require('moment');


const aliExpressWorker = (parameters) => {
    let products = parameters;
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
                            imported: 0,
                            created_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                            updated_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")
                        }
                        let aliQueue = new AliQueue();
                        db.query(aliQueue.getAddAliQueueSQL(), params, (err, data) => {
                            let startUrl =  domain + 'item/' + product.code + '.html';
                            db.query(AliQueue.getAliQueueByFieldNameSQL('status'), ['READY'], (err, data)=>{
                                if(!err) {
                                    if(data && data.length > 0) {
                                        data.map((d, key)=>{
                                            if (d.product_code === product.code.toString()){
                                                let params = [
                                                    'RESERVED', 
                                                    moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"), 
                                                    moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                                                    product.code.toString()
                                                ];
                                                let fields = 'status = ?, reserved_at = ?, updated_at = ?';
                                                let condition = 'product_code = ?';
                                                db.query(AliQueue.updateAliQueueByFieldNameSQL(fields, condition), params, (err, data) => {
                                                    callApifyMain(startUrl);
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    });
                }
            }
        })
    })
}

module.exports = {
    aliExpressWorker
}