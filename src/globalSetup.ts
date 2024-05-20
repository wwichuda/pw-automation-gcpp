import { FullConfig } from "@playwright/test";
import dotenv from "dotenv"
import path from 'path';

async function globalSetup(config: FullConfig) {


 if(process.env.NODE_ENV){
    console.log("NODE_ENV:", process.env.NODE_ENV)
    dotenv.config({
        path: path.join('../app_commons/environments/',`.env.${process.env.NODE_ENV}`),
        override: true
    })
 }
 else{
    dotenv.config({
        path: path.join('../app_commons/environments/',`.env.dev`),
        override: true
    })
 }

 console.log("NODE_ENV:", process.env.NODE_ENV)

}
export default globalSetup;