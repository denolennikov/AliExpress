import express from "express";
import db from "../db/database";
import Source from "../domain/source";
import AliRequest from "../domain/alirequest";
import AliQueue from "../domain/aliqueue";
import callApifyMain from "../services/main";

const uuidv1 = require('uuid/v1');

var moment = require('moment');

const router = express.Router();

router.get("/", (req, res, next) => {

    db.query(Source.getAllSourceSQL(), (err, data)=> {
        if(!err) {
            res.status(200).json({
                message:"Sources listed.",
                sourceId:data
            });
        }
    });
});

router.post("/add", (req, res, next) => {

    //read product information from request
    let source = new Source(
        req.body.storeName, 
        req.body.storeCountry, 
        req.body.storeLanguage, 
        req.body.storeUrl
    );

    db.query(source.getAddSourceSQL(), (err, data)=> {
        res.status(200).json({
            message:"Source added.",
            sourceId: data.insertId
        });
    });
});

router.get("/:sourceId", (req, res, next) => {
    let sid = req.params.sourceId;

    db.query(Source.getSourceByIdSQL(sid), (err, data)=> {
        if(!err) {
            if(data && data.length > 0) {
                res.status(200).json({
                    message:"Source found.",
                    source: data
                });
            } else {
                res.status(200).json({
                    message:"Source Not found."
                });
            }
        }
    });
});

router.post("/delete", (req, res, next) => {

    var sid = req.body.store_id;

    db.query(Source.deleteSourceByIdSQL(sid), (err, data)=> {
        if(!err) {
            if(data && data.affectedRows > 0) {
                res.status(200).json({
                    message:`Source deleted with id = ${sid}.`,
                    affectedRows: data.affectedRows
                });
            } else {
                res.status(200).json({
                    message:"Source Not found."
                });
            }
        }
    });
});

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

        db.query(Source.getSourceByLanguageSQL(lang), (err, data) => {
            if(!err) {
                if(data && data.length > 0) {
                    let domain = data[0].store_url
                    let aliRequest = new AliRequest(uuidv1(), key)
                    db.query(aliRequest.getAddAliRequestSQL(), (err, data)=> {
                        let aliQueue = new AliQueue(
                            uuidv1(), 
                            product.code.toString(), 
                            lang, 
                            null,
                            "READY", 
                            '2008-01-01 00:00:01', 
                            0, 
                            '2008-01-01 00:00:01', 
                            '2008-01-01 00:00:01',
                            moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                            moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")
                        );
                        db.query(aliQueue.getAddAliQueueSQL(), (err, data)=> {
                            let startUrl =  domain + 'item/' + product.code + '.html'
                            db.query(AliQueue.getAliQueueByFieldNameSQL('status', 'READY'), (err, data)=>{
                                data.map((d, key)=>{
                                    if (d.product_code === product.code.toString()){
                                        let param = [
                                            {'status': 'RESERVED'}, 
                                            {'reserved_at': moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")}, 
                                            {'product_code': product.code.toString()}
                                        ]
                                        db.query(AliQueue.updateAliQueueByFieldNameSQL(param), (err, data)=>{
                                            console.log(err, data)
                                            callApifyMain(startUrl);
                                            res.status(200).json({
                                                message:"Ok."
                                            });
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
})

module.exports = router;