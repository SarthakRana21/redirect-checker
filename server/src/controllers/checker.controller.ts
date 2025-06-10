import xlsx from 'xlsx';
import axios from 'axios';
import fs from 'fs/promises';

interface redirectObject {
    address: string;
    status_code: number;
    redirect_url: string;
    expected_url?: string;
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const redirectChecker = async (path: string) => {
    console.log('working')
    const result: redirectObject[] = [];
    const workbook = xlsx.readFile(path)
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    try {
        for (let i = 0; i < data.length; i++) {
        const item = data[i] as redirectObject
        const response = await axios.get(item.address, {
            maxRedirects: 0,
            validateStatus: () => true
        })
        if (response.headers.location !== item.redirect_url) {
            result.push({
                address: item.address,
                status_code: response.status,
                redirect_url: response.headers.location,
                expected_url: item.redirect_url
            })
        }
        await wait(3000)
    }
    } catch (error) {
        console.log(error)
        return error
    }
    await fs.unlink(path)
    // console.log(result)
    return result

}

