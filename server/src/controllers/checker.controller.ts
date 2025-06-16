import xlsx from 'xlsx';
import axios from 'axios';
import fs from 'fs/promises';
import { asyncHandler } from '../utils/AysncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

interface redirectObject {
    address: string;
    status_code?: number;
    redirect_url: string;
    expected_url?: string;
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const redirectChecker = asyncHandler(async (req, res) => {
    const path = req.file?.path
    if (!path) throw new ApiError(400, "No file uploaded")

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
                status_code: response.status || 0,
                redirect_url: response.headers.location,
                expected_url: item.redirect_url
            })
        }
        await wait(Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000)
    }
    } catch (error) {
        console.log(error)
        throw new ApiError(402, error as string)
    }
    await fs.unlink(path)
    // console.log(result)
    return res.status(200).json(new ApiResponse(200, result))
})



// export const redirectChecker = async (path: string) => {
//     console.log('working')
//     const result: redirectObject[] = [];
//     const workbook = xlsx.readFile(path)
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = xlsx.utils.sheet_to_json(sheet);
    
//     try {
//         for (let i = 0; i < data.length; i++) {
//         const item = data[i] as redirectObject
//         const response = await axios.get(item.address, {
//             maxRedirects: 0,
//             validateStatus: () => true
//         })
//         if (response.headers.location !== item.redirect_url) {
//             result.push({
//                 address: item.address,
//                 status_code: response.status || 0,
//                 redirect_url: response.headers.location,
//                 expected_url: item.redirect_url
//             })
//         }
//         await wait(3000)
//     }
//     } catch (error) {
//         console.log(error)
//         return error
//     }
//     await fs.unlink(path)
//     // console.log(result)
//     return result

// }

