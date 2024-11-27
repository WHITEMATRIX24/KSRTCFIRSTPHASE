import axios from "axios";

const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
    const reqConfig = {
        method: httpMethod,
        url,
        data: reqBody,
        headers: reqHeader ? reqHeader : { "Content-Type": "application/json" }
    }
    return await axios(reqConfig).then(res => {
        return res
    }).catch(err => {
        console.error(err.response ? err.response.data : err.message); 
        return { error: err.response ? err.response.data : err.message };
    })
}

export default commonAPI