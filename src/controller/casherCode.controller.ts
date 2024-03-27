import {
    Request,
    Response,
    NextFunction
} from 'express'
import { detailSalePaginate } from '../service/detailSale.service';
import fMsg from '../utils/helper';
import { getAllCasherCodeService } from '../service/casherCode.service';


export const getAllCasherCodeHandler = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try{

        let query = req.query.key;
        if(!query) throw new Error("You need filter key");


        let model:any;

        if(req.query.accessDb){
            model = req.query.accessDb
        }else{
            model = req.body.accessDb
        }



        let {data,count} = await getAllCasherCodeService(query,model);


        fMsg(res,"Casher codes are here",data,model,count);

    }catch(e){
        next(new Error(e))
    }
}