import { actionOptions } from "../../types/interfaces/baseActionoptions";
import { baseConfig } from "../../types/interfaces/baseConfig";

interface safeRunOptions extends actionOptions {
    message: string;
}

export const safeRun = async function<T> (options: safeRunOptions, callBack: (...args: any) => Promise<T>): Promise<T>  {
    let results;
    if(options.log) console.log(options.message);
    try{
        results = await callBack();
    }
    catch(e){
        if(options.throwOnFail) throw e;
        else console.log(e);
    }
    return results as T;
};

export const getActionOptionsFromConfig = (config: baseConfig): actionOptions => ({
    timeout: config.actionTimeout,
    log: config.logs,
    throwOnFail: config.throwOnFail,
});